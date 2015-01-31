var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('video', {
		height: '135%',
		width: '135%',
		videoId: 'FUDqhGmPuCc',
		playerVars: {
			controls: '0',
			modestbranding: '1',
			loop: '1'
		},
		events: {
			'onReady': onPlayerReady
		}
	});
}

function onPlayerReady(event) {
	player.setVolume(0);
	player.playVideo();
}