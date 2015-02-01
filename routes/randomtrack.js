var express = require('express');
var _ = require('underscore-node');
var async = require('async');
var URI = require('URIjs');
var urlExpander=require('expand-url');

var router = express.Router();

function twitterSearch(twitter, pattern, count, callback) {
	twitter.get('/search/tweets', { 
			q: pattern,
        	result_type: "recent",
        	count: count 
		}, function(error, tweetData, response) {
			var tweets = _.map(tweetData.statuses, function(tweet) {
				return tweet.text;
			});
			callback(tweets);
		});
}

function twitterSearchUrls(twitter, pattern, count, callback) {
	twitterSearch(twitter, pattern, count, function(tweets) {
		var urls = _.chain(tweets).map(function(tweet){
			var innerUrls = [];
			var result = URI.withinString(tweet, function(url) {
				innerUrls.push(url);
				return url;
			});
			return innerUrls;
		}).flatten().value();
		callback(urls);
	});
}

function expandUrls(urls, callback)
{
	async.map(urls, function(url, callback) {
		urlExpander.expand(url, function(err, longUrl){
			callback(null, longUrl);
		});
	}, function(err, results) {
		callback(results);
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {

	// search for twitter posts with urls in them
	var twitter = req.session.twitter;
	twitterSearchUrls(twitter, 'site:soundcloud.com', 25, function(urls) {
		expandUrls(urls, function(longUrls){
			console.log(longUrls);
		});
	});
});

module.exports = router;