var express = require('express')
var exphbs = require('express-handlebars')
var fs = require('fs')
var request = require('request')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var redis = require('redis')
var mongodb = require('mongodb')
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var nconf = require('nconf')
var compression = require('compression')
var passport = require('passport')
var thumbnail = require('./thumbnail')
var GitHubStrategy = require('passport-github').Strategy
var path = require('path')

var app = express()

var http = require('http')
var https = require('https')
var privateKey, certificate;
var callbackURL = "http://localhost:8889/auth/github/callback"
try {
  privateKey = fs.readFileSync(`${__dirname}/sslcert/privkey.pem`, 'utf8')
  certificate = fs.readFileSync(`${__dirname}/sslcert/fullchain.pem`, 'utf8')
  // if we have a certificate, we are in production (this should be better configured)
  callbackURL = "https://blockbuilder.org/auth/github/callback"
} catch(e) {
  console.log("error with https files", e)
}

var credentials = { key: privateKey, cert: certificate }

// App middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/public', express.static(__dirname + '/public'))
// don't expose server info
app.disable('x-powered-by')
// Show stack errors
app.set('showStackError', true)
// Compress (gzip) everything
app.use(compression())

// Setup handlebars so we can do a small amount of server-side templating
var hbs = exphbs.create({
  helpers: {
    json: function(context) {
      return JSON.stringify(context)
    }
  }
})
app.engine(
  'handlebars',
  exphbs({
    extname: '.handlebars',
    defaultLayout: 'base',
    partialsDir: path.join(__dirname, '/views'),
    layoutsDir: path.join(__dirname, '/views')
  })
)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')
// in production we need to set:
// process.env.NODE_ENV === "production"
// to turn on caching
// app.enable('view cache')

// Load the configuration
nconf.file('resources', __dirname + '/resources.json')
nconf.file('secrets', __dirname + '/secrets.json')
if (!nconf.get('github')) {
  throw new Error(
    'secrets.json file NOT found. be sure to `cp secrets.json-example secrets.json`'
  )
}

// if running blockbuilder-search-index
var esIndexer = nconf.get('elasticsearch-indexer') || {}

nconf.add('app', {
  type: 'literal',
  app: {
    port: nconf.get('port') || 8889,
    allowedDomains: '*',
    cookie: {
      maxAge: 86400000 * 365, // one year, in milliseconds
      httpOnly: true,
      key: '_c',
      secret: 'd0f03jiioj>?re4l12kj"f23jiioj>?re4l12kj"l;l'
    }
  }
})

app.use(cookieParser())
var redisClient = redis.createClient(
  nconf.get('app:redis:port'),
  nconf.get('app:redis:host')
)
redisClient.on('error', function(err) {
  // catch redis errors so server doesn't blow up
  console.error('Redis client error:' + err)
})

app.use(
  session({
    secret: 'f023u0fu0fi2039if023r09390jljnvcvoejfpeiqur384092830',
    cookie: nconf.get('app:cookie'),
    store: new RedisStore({
      host: nconf.get('app:redis:host'),
      port: nconf.get('app:redis:port'),
      ttl: 60 * 60 * 24 * 7 * 2, // 2 weeks, in seconds
      client: redisClient
    })
  })
)

// ------------------------------------
// AUTHENTICATION
// ------------------------------------
app.use(passport.initialize())

var MongoClient = mongodb.MongoClient
var mongoUrl =
  'mongodb://' +
  nconf.get('app:mongo:host') +
  ':' +
  nconf.get('app:mongo:port') +
  '/' +
  nconf.get('app:mongo:db')
MongoClient.connect(
  mongoUrl,
  function(err, db) {
    var users = db.collection('users')

    passport.serializeUser(function(user, done) {
      done(null, {
        id: user.id,
        login: user.login,
        avatar_url: user.avatar_url,
        accessToken: user.accessToken
      })
    })

    passport.deserializeUser(function(id, done) {
      // This is called to return a user from a passport
      // stategy (e.g., after user logs in with GitHub)
      // This also is what req.user is set to
      users.findOne({ _id: id }, function(err, user) {
        done(err, user)
      })
    })

    passport.use(
      new GitHubStrategy(
        {
          clientID: nconf.get('github:clientId'),
          clientSecret: nconf.get('github:secret'),
          callbackURL: callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
          var profileId = profile.id + '' // we make sure we are always using strings for our internal ids

          users.findOne({ _id: profileId }, function(err, user) {
            if (!user) {
              profile._id = profileId
              user = profile._json
              user._id = profileId
              users.update({ _id: profileId }, user, { upsert: true }, function(
                err
              ) {
                profile.id = +profile.id // GitHub seems to return a string upon user creation (but numbers the rest of the time)
                profile.login = user.login
                profile.avatar_url = user.avatar_url
                profile.accessToken = accessToken
                return done(err, profile)
              })
            } else {
              user.accessToken = accessToken
              return done(err, user)
            }
          })
        }
      )
    )

    app.use(passport.session())
  }
)

app.get('/auth/github', function(req, res, next) {
  if (req.query.redirect) {
    req.session.redirectTo = req.query.redirect
  }
  passport.authenticate('github', { scope: 'gist' })(req, res, next)
})

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    // delete req.session.redirectTo;
    res.send(
      "<html><h1>w00t!</h1><script>window.opener.postMessage({type: 'loggedin'}, window.location.origin);window.close();</script></html>"
    )
  }
)
app.get('/auth/logout', function(req, res) {
  req.logout()
  if (req.query.redirect) {
    return res.redirect(req.query.redirect)
  }
  res.redirect('/')
})

// ------------------------------------
// SEARCH
// ------------------------------------
// we optionally support a search page if you've installed and setup the search module
// https://github.com/enjalot/blockbuilder-search
var searchConf = nconf.get('search')
if (searchConf) {
  var bbSearch = require('blockbuilder-search')(
    searchConf,
    app,
    nconf.get('analytics:ga')
  )
  app.get('/search', bbSearch.page)
  app.get('/api/search', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    bbSearch.api(req, res, next)
  })
  app.get('/api/aggregateD3api', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    bbSearch.aggregateD3API(req, res, next)
  })
  app.get('/api/aggregateD3modules', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    bbSearch.aggregateD3Modules(req, res, next)
  })
}

// ------------------------------------
// API
// ------------------------------------
// Get the authenticated user
app.get('/api/me', function(req, res) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // this is safe as it is just the user id, login name and avatar url
  var user
  if (req.session.passport) user = req.session.passport.user
  if (!user) return res.send({})
  res.send({ id: user.id, login: user.login, avatar_url: user.avatar_url })
})
// Get a gist by id
app.get('/api/gist/:gistId', function(req, res) {
  // we have a proxy for getting a gist using the app's auth token.
  // this allows us to get around the low rate-limit for anonymous requests.
  // we can also add caching here later

  // this is potentially not a good idea. but lets do it until its a problem
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var gistId = req.params.gistId
  getGist(gistId, function(err, gist) {
    if (gist && gist.message === 'Not Found') {
      return res.status(404).send({ error: gist })
    }
    if (err) {
      return res.status(500).send({ error: err })
    }
    res.send(gist)
  })
})
app.post('/api/save', function(req, res) {
  // this is potentially not a good idea. but lets do it until its a problem
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var gist = req.body.gist
  var token
  if (req.session.passport && req.session.passport.user)
    token = req.session.passport.user.accessToken
  if (!token) return res.status(403).send({ error: 'Not logged in' })
  saveGist(gist, 'PATCH', token, function(err, response) {
    if (err) {
      console.log(err)
      return res.status(400).send({ error: err })
    }
    res.status(200).send(response)
    indexGist(response)
  })
})

// Create a new gist
app.post('/api/fork', function(req, res) {
  // Potentially allow some other domains to post anon gists to quickly enable saving
  // will want to add their domains here if we want to do this
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var gist = req.body.gist
  var token
  if (req.session.passport && req.session.passport.user)
    token = req.session.passport.user.accessToken
  saveGist(gist, 'POST', token, function(err, response) {
    if (err) {
      console.log(err)
      return res.status(400).send({ error: err })
    }
    console.log('forked to', response.id)
    res.status(200).send(response)
    indexGist(response)
  })
})

// allow a user to commit a thumbnail to their gist
app.post('/api/thumbnail', function(req, res) {
  var token
  if (req.session.passport && req.session.passport.user)
    token = req.session.passport.user.accessToken
  if (!token) return res.status(403).send({ error: 'Not logged in' })
  var gistId = req.body.gistId
  var image = req.body.image // base64 encoded png
  thumbnail.save(gistId, image, token, function(err) {
    if (err) {
      console.log(err)
      return res.status(400).send({ error: err })
    }
    console.log('thumbnail saved')
    res.status(200).send('ok')
  })
})

// We try to send the gist to our ElasticSearch daemon who will figure out how to index it
// we don't care if it fails, this is optional anyway (only happens if elasticsearch is configured in secrets.json)
function indexGist(gist) {
  // console.log("esIndexer", esIndexer.host, gist.public)
  if (!gist) return
  if (!esIndexer.host) return
  if (
    gist.public &&
    (gist.description && gist.description.indexOf('[UNLISTED]') < 0)
  ) {
    var options = {
      method: 'GET',
      url: esIndexer.host + '/index/gist/' + gist.id
    }
    // console.log("posting", options)
    request(options, function(err, response) {
      // console.log(err, response)
      if (err) console.log(err)
      if (response) console.log('indexed', gist.id, response.statusCode)
    })
  } else {
    var options = {
      method: 'GET',
      url: esIndexer.host + '/delete/gist/' + gist.id
    }
    request(options, function(err, response) {
      // console.log(err, response)
      if (err) console.log(err)
      if (response) console.log('deleted', gist.id, response.statusCode)
    })
  }
}

// ------------------------------------
// App routes
// ------------------------------------
app.get('/', function(req, res) {
  var user
  if (req.session.passport) user = req.session.passport.user
  return res.render('base', { user: user, ga: nconf.get('analytics:ga') })
})

app.get('/_elb', function(req, res) {
  return res.send('Ok')
})

app.get('/about', function(req, res) {
  var user
  if (req.session.passport) user = req.session.passport.user
  return res.render('base', { user: user, ga: nconf.get('analytics:ga') })
})

app.get('/gallery', function(req, res) {
  var user
  if (req.session.passport) user = req.session.passport.user
  return res.render('base', { user: user, ga: nconf.get('analytics:ga') })
})

// Get a user's profile page
app.get('/:username', function(req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var user
  if (req.session.passport) user = req.session.passport.user
  return res.render('base', { user: user, ga: nconf.get('analytics:ga') })
})

// Get the block editing page for a particular gist
app.get('/:username/:gistId', function(req, res) {
  var gistId = req.params.gistId
  var user

  // the currently logged in user
  if (req.session.passport) user = req.session.passport.user
  // we are going to load the gist server side so we can pull metadata
  // for generating the social cards. eventually it should also be used
  // to populate the app, rather than another API hit
  getGist(gistId, function(err, response) {
    var gist = {}
    try {
      gist = JSON.parse(response.body)
    } catch (e) {}
    var meta
    if (err) {
      // return; //res.status(500).send({error: err});
    } else {
      var files = gist.files
      var thumbnail = ''
      if (files && files['thumbnail.png'])
        thumbnail = files['thumbnail.png'].raw_url
      // the author of the gist
      var author = ''
      if (gist.owner) author = '@' + gist.owner.login
      meta = {
        author: author,
        title: gist.description,
        thumbnail: thumbnail
      }
    }
    // TODO: since we have already fetched the gist, it would be nice to send it down to the page right here.
    // this would save an additional request and load things faster
    return res.render('base', {
      user: user,
      ga: nconf.get('analytics:ga'),
      meta: meta
    })
  })
})

function saveGist(gist, method, token, cb) {
  var url = 'https://api.github.com/gists'

  // if we are to save over a user's gist we need the id
  var parsed = JSON.parse(gist)
  if (parsed.id) console.log('saving', parsed.id)

  if (method === 'PATCH' && parsed && parsed.id) {
    url += '/' + parsed.id
  } else {
    // FORKED
    gist = modifyGistForHistory(parsed)
  }
  var headers = {
    'User-Agent': 'Bl.ock Builder',
    'content-type': 'application/json',
    accept: 'application/json'
  }
  if (token) {
    headers['Authorization'] = 'token ' + token
  }
  var options = {
    url: url,
    body: gist.toString(),
    method: method,
    headers: headers
  }
  if (!token) {
    options.qs = {
      client_id: nconf.get('github:clientId'),
      client_secret: nconf.get('github:secret')
    }
  }
  request(options, onResponse)

  function onResponse(error, response, body) {
    // console.log("error", error)
    // console.log("response", response.statusCode)
    // console.log("body", body)
    if (error) {
      return cb(error, null)
    }
    if (
      !error &&
      (response.statusCode === 201 || response.statusCode === 200)
    ) {
      cb(null, JSON.parse(body))
    } else if (!error) {
      cb(body, null)
    } else {
      cb(error, null)
    }
  }
}

function modifyGistForHistory(gist) {
  // make sure this gist was forked from an existing gist
  if (!gist.id) return JSON.stringify(gist)

  var username = 'anonymous'
  if (gist.owner) {
    username = gist.owner.login
  }

  var historyLine =
    "\n\nforked from <a href='http://bl.ocks.org/" +
    username +
    "/'>" +
    username +
    "</a>'s block: <a href='http://bl.ocks.org/" +
    username +
    '/' +
    gist.id +
    "'>" +
    gist.description +
    '</a>'

  if (!gist.files['README.md']) {
    gist.files['README.md'] = { filename: 'README.md', content: historyLine }
  } else {
    gist.files['README.md'].content += historyLine
  }
  return JSON.stringify(gist)
}

function getGist(gistId, cb) {
  // TODO: use a cache to avoid hitting the API everytime. would need to invalidate on save.
  var options = {
    url: 'https://api.github.com/gists/' + gistId,
    qs: {
      client_id: nconf.get('github:clientId'),
      client_secret: nconf.get('github:secret')
    },
    headers: {
      'User-Agent': 'Bl.ock Builder'
    }
  }
  request.get(options, cb)
}

// ------------------------------------
// Run the server
// ------------------------------------

// var server = app.listen(nconf.get('app:port'), function() {
//   var host = server.address().address
//   if (host === '::') host = '[::]'
//   var port = server.address().port

//   console.log('Bl.ock Builder listening at http://%s:%s', host, port)
// })

var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

httpServer.listen(nconf.get('app:port'))
httpsServer.listen(8443)
