var counter = 0;
var intervalMS = 15000;
var lastTimoutTime = _.now();
var lastIntervalTime = _.now();

function startTimeout() {
	setTimeout(function() {
		console.log("timeout happened", counter++, (_.now() - lastTimoutTime)/1000.0);
		lastTimoutTime = _.now();
		startTimeout();
	}, intervalMS);
}

startTimeout();
setInterval(function() {
		console.log("interval happened", (_.now() - lastIntervalTime)/1000.0);
		lastIntervalTime = _.now();
}, intervalMS);