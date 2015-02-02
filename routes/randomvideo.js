var express = require('express');
var _ = require('underscore-node');
var videosJSON = require('../config/videos.json')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var video = _.sample(videosJSON);
	res.json({'url': video.url, 'startAt': video.startAt });
});

module.exports = router;