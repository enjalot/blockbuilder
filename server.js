var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');
var app = express();

app.use(express.static('public'));

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


app.get('/js/client.js', function (req, res) {
  res.sendFile(__dirname + '/client.js');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/home.html');
});

app.get('/gist/:gistId', function(req, res) {
  // we have a proxy for getting a gist using the app's auth token.
  // this allows us to get around the low rate-limit for anonymous requests.
  // we can also add caching here later
  var gistId = req.params.gistId;
  getGist(gistId, function(err, gist) {
    if(err) {
      res.send(500, {error: err})
    }
    res.send(gist)
  })
})

app.get('/:userName', function (req, res) {
  res.sendFile(__dirname + '/templates/user.html');
});

app.get('/:userName/:gistId', function (req, res) {
  var userName = req.params.userName
  var gistId = req.params.gistId
  res.render('block', {gistId: gistId, userName: userName})
});



function getGist(gistId, cb) {
  // TODO: add our app's token to avoid rate limiting
  var options = {
    url: "https://api.github.com/gists/" + gistId,
    headers: {
      'User-Agent': 'Building Bl.ocks server'
    }
  }
  request.get(options, cb);
}

var server = app.listen(8889, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Building Bl.ocks listening at http://%s:%s', host, port);
});