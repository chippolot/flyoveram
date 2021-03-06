var SOUNDCLOUD_CLIENT_ID = null;

function soundcloudInitialize(clientId)
{
	SOUNDCLOUD_CLIENT_ID = clientId;

	// Initialize Sound Cloud
	SC.initialize({
		client_id: SOUNDCLOUD_CLIENT_ID
	});
}

function soundcloudStream(trackId, params, callback)
{
	_.extend(params, { 
		useHTML5Audio: true,
		preferFlash: false});
	SC.stream("/tracks/" + trackId, params, callback);
}