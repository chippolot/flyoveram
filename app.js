// dependencies
var express = require('express');
var logger = require('morgan');
var twitter = require('twitter');
var soundcloud = require('soundcloud-resolver');

// authenticate twitter
var twitterClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// authenticate soundcloud
var soundcloudClient = new soundcloud(
  process.env.SOUNDCLOUD_CONSUMER_KEY
);

// routes
var route_index = require('./routes/index');
var route_randomtracks = require('./routes/randomtracks');

var app = express();
app.set('views', __dirname + '/views');

app.use(logger('dev'));

// serve static files from public
app.use(express.static(__dirname + '/public'));

// pipe session variables
app.use(function(req, res, next) {
  req.session = req.session || {};
  req.session.twitter = twitterClient;
  req.session.soundcloud = soundcloudClient;
  next();
});

// setup routes
app.use('/', route_index);
app.use('/randomtracks', route_randomtracks);

// listen on port 3000
app.listen(process.env.PORT || 3000)