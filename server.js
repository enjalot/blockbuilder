var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();
var compression = require('compression');

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

// ------------------------------------
// App routes
// ------------------------------------
app.get('/', function (req, res) {
  return res.render('base');
});

// Get a user's profile page
app.get('/:username', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;

  return res.render('base');
});

// Get the block editing page for a particular gist
app.get('/:username/:gistId', function (req, res) {
  // NOTE: no data needs to be passed into template; react router gets url
  // params
  var username = req.params.username;
  var gistId = req.params.gistId;

  return res.render('base');
});


// ------------------------------------
// API
// ------------------------------------
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

var server = app.listen(8889, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Building Bl.ocks listening at http://%s:%s', host, port);
});
