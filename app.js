// dependencies
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');
var logger = require('morgan');
var twitter = require('twitter');

// authenticate twitter
var twitterClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// routes
var route_index = require('./routes/index');
var route_randomtrack = require('./routes/randomtrack');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// use jade for view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));

// serve static files from public
app.use(express.static(__dirname + '/public'));

// pipe session variables
app.use(function(req, res, next) {
  req.session = req.session || {};
  req.session.twitter = twitterClient;
  next();
});

// setup routes
app.use('/', route_index);
app.use('/randomtrack', route_randomtrack);

// listen on port 3000
app.listen(process.env.PORT || 3000)