var express = require('express');
var _ = require('underscore-node');
var videosJSON = require('../config/videos.json')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json({'url': _.sample(videosJSON)});
});

module.exports = router;