var fs = require('fs');
var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var redis = require('redis')
var mongodb = require('mongodb')
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var nconf = require('nconf')
var compression = require('compression');
var passport = require('passport')

var thumbnail = require('./thumbnail')


var app = express();

// App middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
// don't expose server info
app.disable('x-powered-by');
// Show stack errors
app.set('showStackError', true);
// Compress (gzip) everything
app.use(compression());

// Setup handlebars so we can do a small amount of server-side templating
var hbs = exphbs.create({
  helpers: {
    json: function (context) { return JSON.stringify(context); },
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// in production we need to set:
// process.env.NODE_ENV === "production"
// to turn on caching
//app.enable('view cache')

// Load the configuration
nconf.file('resources', __dirname + '/resources.json');
nconf.file('secrets', __dirname + '/secrets.json');
if(!nconf.get('github')){
    throw new Error('secrets.json file NOT found. be sure to `cp secrets.json-example secrets.json`');
}

nconf.add('app', {
  'type': 'literal',
  'app': {
    'port': 8889,
    'allowedDomains': '*',
    'cookie': {
        'maxAge': 86400000 * 365, //one year, in milliseconds
        httpOnly: true,
        'key': '_c',
        'secret': 'd0f03jiioj>?re4l12kj"f23jiioj>?re4l12kj"l;l'
    }
  }
});

app.use(cookieParser());
var redisClient = redis.createClient(
    nconf.get('app:redis:port'),
    nconf.get('app:redis:host')
);
redisClient.on('error', function(err) {
    //catch redis errors so server doesn't blow up
    console.error('Redis client error:' + err);
});

app.use(session({
  secret: "f023u0fu0fi2039if023r09390jljnvcvoejfpeiqur384092830",
  cookie: nconf.get('app:cookie'),
  store: new RedisStore({
    host: nconf.get('app:redis:host'),
    port: nconf.get('app:redis:port'),
    ttl: 60 * 60 * 24 * 7 * 2, //2 weeks, in seconds
    client: redisClient
  })
}));

// ------------------------------------
// AUTHENTICATION
// ------------------------------------
app.use(passport.initialize());

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://' + nconf.get('app:mongo:host')
  + ':' + nconf.get('app:mongo:port')
  + '/' + nconf.get('app:mongo:db');
MongoClient.connect(mongoUrl, function(err, db) {
  var users = db.collection('users');

  passport.serializeUser(function(user, done) {
    done(null, {id: user.id, login: user.login, avatar_url: user.avatar_url, accessToken: user.accessToken });
  });
  passport.deserializeUser(function(id, done) {
    // This is called to return a user from a passport
    // stategy (e.g., after user logs in with GitHub)
    // This also is what req.user is set to
    users.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });
  GitHubStrategy = require('passport-github').Strategy;
  passport.use(new GitHubStrategy({
      clientID: nconf.get('github:clientId'),
      clientSecret: nconf.get('github:secret'),
      callbackURL: "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      users.findOne({ '_id': profile.id }, function (err, user) {
        if(!user) {
          profile._id = profile.id;
          user = profile._json;
          user._id = profile.id;
          users.update({_id: profile.id}, user, {upsert: true}, function(err){
            profile.login = user.login;
            profile.avatar_url = user.avatar_url;
            profile.accessToken = accessToken;
            return done(err, profile);
          });
        } else {
          user.accessToken = accessToken;
          return done(err, user);
        }
      });
    }
  ));

  app.use(passport.session());
});

app.get('/auth/github', function(req, res, next) {
  if(req.query.redirect){
    req.session.redirectTo = req.query.redirect;
  }
  passport.authenticate('github', {scope: 'gist'})(req, res, next);
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;
    //is authenticated ?
    res.redirect(redirectTo);
});
app.get('/auth/logout', function(req, res) {
  req.logout();
  if(req.query.redirect){
    return res.redirect(req.query.redirect);
  }
  res.redirect('/');
});


// ------------------------------------
// API
// ------------------------------------
// Get the authenticated user
app.get('/api/me', function(req, res) {
  // this is safe as it is just the user id, login name and avatar url
  var user;
  if(req.session.passport) user = req.session.passport.user;
  if(!user) return res.send({});
  res.send({id: user.id, login: user.login, avatar_url: user.avatar_url});
});
// Get a gist by id
app.get('/api/gist/:gistId', function(req, res) {
  // we have a proxy for getting a gist using the app's auth token.
  // this allows us to get around the low rate-limit for anonymous requests.
  // we can also add caching here later
  var gistId = req.params.gistId;
  getGist(gistId, function(err, gist) {
    if(err) {
      res.status(500).send({error: err});
    }
    res.send(gist);
  });
});
app.post('/api/save', function(req, res){
  var gist = req.body.gist;
  var token;
  if(req.session.passport.user) token = req.session.passport.user.accessToken;
  if(!token) return res.status(403).send({error: "Not logged in"});
  saveGist(gist, "PATCH", token, function(err, response) {
    if(err){ console.log(err); return res.status(400).send({error: err}); }
    console.log("saved to", response.id);
    res.status(200).send(response);
  });
});

// Create a new gist
app.post('/api/fork', function (req, res) {
  // Potentially allow some other domains to post anon gists to quickly enable saving
  // will want to add their domains here if we want to do this
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var gist = req.body.gist;
  var token;
  if(req.session.passport.user) token = req.session.passport.user.accessToken;
  saveGist(gist, "POST", token, function(err, response) {
    if(err){ console.log(err); return res.status(400).send({error: err}); }
    console.log("forked to", response.id);
    res.status(200).send(response);
  });
});

app.post('/api/thumbnail', function (req, res){
  var token;
  if(req.session.passport.user) token = req.session.passport.user.accessToken;
  if(!token) return res.status(403).send({error: "Not logged in"});
  var gistId = req.body.gistId;
  var image = req.body.image; //base64 encoded png
  thumbnail.save(gistId, image, token, function(err) {
    if(err){ console.log(err); return res.status(400).send({error: err}); }
    console.log("thumbnail saved")
    res.status(200).send("ok")
  });
})


// ------------------------------------
// App routes
// ------------------------------------
app.get('/', function (req, res) {
  var user;
  if(req.session.passport) user = req.session.passport.user;
  return res.render('base', {user: user, ga: nconf.get("analytics:ga")});
});

app.get('/_elb', function(req, res) {
  return res.send("Ok")
})


app.get('/about', function (req, res) {
  var user;
  if(req.session.passport) user = req.session.passport.user;
  return res.render('base', {user: user, ga: nconf.get("analytics:ga")});
});

app.get('/gallery', function (req, res) {
  var user;
  if(req.session.passport) user = req.session.passport.user;
  return res.render('base', {user: user, ga: nconf.get("analytics:ga")});
});

// Get a user's profile page
app.get('/:username', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;
  var user;
  if(req.session.passport) user = req.session.passport.user;
  return res.render('base', {user: user, ga: nconf.get("analytics:ga")});
});

// Get the block editing page for a particular gist
app.get('/:username/:gistId', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;
  var gistId = req.params.gistId;

  var user;
  if(req.session.passport) user = req.session.passport.user;
  return res.render('base', {user: user, ga: nconf.get("analytics:ga")});
});

function saveGist(gist, method, token, cb) {
  var url = 'https://api.github.com/gists';

  // if we are to save over a user's gist we need the id
  var parsed = JSON.parse(gist);
  if(parsed.id) console.log("saving", parsed.id);

  if(method === "PATCH" && parsed && parsed.id) {
    url += "/" + parsed.id;
  } else {
    // FORKED
    gist = modifyGistForHistory(parsed);
  }
  var headers = {
    'User-Agent': 'Building Bl.ocks'
  , 'content-type': 'application/json'
  , 'accept': 'application/json'
  };
  if(token) {
    headers['Authorization'] = 'token ' + token
  } 
  var options = {
    url: url,
    body: gist.toString(),
    method: method,
    headers: headers
  }
  if(!token) {
    options.qs = {
      'client_id': nconf.get('github:clientId'),
      'client_secret': nconf.get('github:secret')
    }
  }
  request(options, onResponse);

  function onResponse(error, response, body) {
    //console.log("error", error)
    //console.log("response", response.statusCode)
    //console.log("body", body)
    if(error) { return cb(error, null); }
    if (!error && (response.statusCode === 201 || response.statusCode === 200)) {
      cb(null, JSON.parse(body));
    } else if(!error) {
      cb(body, null);
    }else {
      cb(error, null);
    }
  }
}

function modifyGistForHistory(gist) {
  // make sure this gist was forked from an existing gist
  if(!gist.id) return JSON.stringify(gist);

  var username = "anonymous";
  if(gist.owner) {
    username = gist.owner.login;
  }

  historyLine = "\n\nforked from <a href='http://bl.ocks.org/" + username + "/'>"
    + username + "</a>'s block: <a href='http://bl.ocks.org/" + username + "/" + gist.id + "'>" 
    + gist.description + "</a>"

  if(!gist.files['README.md']) {
    gist.files['README.md'] = { filename: 'README.md', content: historyLine }
  } else {
    gist.files['README.md'].content += historyLine;
  }
  return JSON.stringify(gist);
}

function getGist(gistId, cb) {
  // TODO: add our app's token to avoid rate limiting
  var options = {
    url: "https://api.github.com/gists/" + gistId,
    qs: {
      'client_id': nconf.get('github:clientId'),
      'client_secret': nconf.get('github:secret')
    },
    headers: {
      'User-Agent': 'Building Bl.ocks'
    }
  };
  request.get(options, cb);
}

var server = app.listen(nconf.get('app:port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Building Bl.ocks listening at http://%s:%s', host, port);
});
