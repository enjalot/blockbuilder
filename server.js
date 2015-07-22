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
nconf.file('secrets', __dirname + '/secrets.json');
nconf.add('app', {
  'type': 'literal',
  'app': { 
    'port': 8889,
    'allowedDomains': '*',
    'cookie': {
        'maxAge': 86400000, //one year
        httpOnly: true,
        'key': '_c',
        'secret': 'd0f03jiioj>?re4l12kj"f23jiioj>?re4l12kj"l;l'
    },
    'redis': {
      'host': 'localhost',
      'port': 6379
    },
    'mongo': {
      'host': 'localhost',
      'port': 27017,
      'db': 'building-blocks'
    }
  }
});
console.log("REDIS",nconf.get('app:redis:host'))

app.use(cookieParser());

var redisClient = redis.createClient(
    nconf.get('app:redis:port'), 
    nconf.get('app:redis:host')
); 
redisClient.on('error', function(err) {
    //catch redis errors so server doesn't blow up
    winston.error('Redis client error:' + err);
});
app.use(session({
  secret: "f023u0fu0fi2039if023r09390jljnvcvoejfpeiqur384092830",
  cookie: nconf.get('app:cookie'),
  store: new RedisStore({ 
    host: nconf.get('app:redis:host'),
    port: nconf.get('app:redis:port'),
    ttl: 60 * 60 * 24 * 14, //2 weeks, in seconds
    client: redisClient
  })
}));

// ------------------------------------
// AUTHENTICATION
// ------------------------------------
app.use(passport.initialize());

var MongoClient = mongodb.MongoClient
var url = 'mongodb://' + nconf.get('app:mongo:host') 
  + ':' + nconf.get('app:mongo:port') 
  + '/' + nconf.get('app:mongo:db');
console.log("mongo URL", url)
MongoClient.connect(url, function(err, db) {
  var users = db.collection('users')

  passport.serializeUser(function(user, done) {
    done(null, {id: user.id, login: user.login, avatar_url: user.avatar_url });
  });
  passport.deserializeUser(function(id, done) {
    // This is called to return a user from a passport
    // stategy (e.g., after user logs in with FB)
    // This also is what req.user is set to
    users.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });
  GitHubStrategy = require('passport-github').Strategy
  passport.use(new GitHubStrategy({
      clientID: nconf.get('github:clientId'),
      clientSecret: nconf.get('github:secret'),
      callbackURL: "http://localhost:8889/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      users.findOne({ '_id': profile.id }, function (err, user) {
        if(!user) {
          profile._id = profile.id;
          user = profile._json;
          user._id = profile.id;
          users.update({_id: profile.id}, user, {upsert: true}, function(err){
            return done(err, profile);
          })
        } else {
          return done(err, user);
        }
      });
    }
  ));

  app.use(passport.session());
});

app.get('/auth/github',function(req, res, next) {
  if(req.query.redirect){
    req.session.redirectTo = req.query.redirect
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
  console.log("req", req.query, req.params)
  if(req.query.redirect){
    return res.redirect(req.query.redirect)
  }
  res.redirect('/');
})


// ------------------------------------
// API
// ------------------------------------
// Get the authenticated user
app.get('/api/me', function(req, res) {
  // this is safe as it is just the user id, login name and avatar url
  res.send(req.session.passport.user);
})
// Get a gist by id
app.get('/api/gist/:gistId', function(req, res) {
  // we have a proxy for getting a gist using the app's auth token.
  // this allows us to get around the low rate-limit for anonymous requests.
  // we can also add caching here later
  var gistId = req.params.gistId;
  getGist(gistId, function(err, gist) {
    if(err) {
      res.send(500, {error: err});
    }
    res.send(gist);
  });
});
app.post('/api/save', function(req, res){
  var data = req.body.gist;
  console.log("SAVING", data.id);
  saveGist(data, "PATCH", function(err, response) {
  });
});

// Create a new gist 
app.post('/api/fork', function (req, res) {
  var gist = req.body.gist;
  saveGist(gist, "POST", function(err, data) {
    if(err){ return res.send({error: err, statusCode: 400}); }
    res.send(data);
  });
});


// ------------------------------------
// App routes
// ------------------------------------
app.get('/', function (req, res) {
  console.log("user", req.session.passport)
  return res.render('base', {user: req.session.passport.user});
});

// Get a user's profile page
app.get('/:username', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;

  return res.render('base', {user: req.session.passport.user});
});

// Get the block editing page for a particular gist
app.get('/:username/:gistId', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;
  var gistId = req.params.gistId;

  return res.render('base', {user: req.session.passport.user});
});

function saveGist(gist, method, cb) {
  var url = 'https://api.github.com/gists';

  // if we are to save over a user's gist we need the id
  var parsed = JSON.parse(gist);
  console.log("saving", parsed.id)
  if(method === "PATCH" && parsed && parsed.id) {
    url += "/" + parsed.id;
  }
  var headers = {
    'User-Agent': 'Building Bl.ocks'
  , 'content-type': 'application/json'
  , 'accept': 'application/json'
  };

  request({
    url: url,
    body: gist.toString(),
    method: method,
    headers: headers
  }, onResponse);

  function onResponse(error, response, body) {
    //console.log("error", error)
    //console.log("response", response)
    //console.log("body", body)
    if(error) { return cb(error, null); }
    if (!error && response.statusCode === 201) {
      cb(null, JSON.parse(body));
    } else if(!error) {
      cb(body, null);
    }else {
      cb(error, null);
    }
  }
}



function getGist(gistId, cb) {
  // TODO: add our app's token to avoid rate limiting
  var options = {
    url: "https://api.github.com/gists/" + gistId,
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
