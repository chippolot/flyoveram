function lerp(start, end, t) {
	return start + (end - start) * t;
}

function randomInRange(min, max) {
	return min + (max - min) * Math.random();
}

var STATIC_FADE_DURATION = 0.75;

var STATIC_MIN_VOLUME = 40;
var STATIC_MAX_VOLUME = 80;

var MUSIC_MIN_VOLUME = 0;
var MUSIC_MAX_VOLUME = 30;

var MIN_MUSIC_PLAY_DURATION = 8;
var MAX_MUSIC_PLAY_DURATION = 12;

var MIN_MUSIC_PLAY_COOLDOWN = 6;
var MAX_MUSIC_PLAY_COOLDOWN = 15;


(function(){
	
	this.Radio = function() { this.initialize(); };

	Radio.prototype = {
		initialize:function() {
			this.trackIds = [];
			this.playingSound = null;

			this.staticFadePercent = 0;

			this.staticSound = new buzz.sound( "/assets/static", {
			    formats: [ "mp3" ]
			});
		},

		start:function() {
			this.staticSound.play().loop();

			this.fadeOutMusic();
			this.playNextTrack();
		},

		getRandomTracks:function(callback) {
			invokeAPIMethod("randomtracks", $.proxy(function(result){
				this.trackIds = result.trackIds;
				this.trackIds = _.shuffle(this.trackIds);
				callback();
			}, this));
		},

		playNextTrack:function() {

			// If we're out of tracks, grab a new set
			if (this.trackIds.length == 0) {
				this.getRandomTracks($.proxy(function(){
					this.playNextTrack();
				}, this));
				return;
			}

			// Grab the first track on the list
			var trackId = this.trackIds.shift();

			// Stream the song
			soundcloudStream(trackId, {}, $.proxy(function(sound) {

				this.playingSound = sound;
				this.playingSound.play();

				/*var randomPercent = Math.random();
				var position = randomPercent * 30000;
				this.playingSound.setPosition(position);*/

				this.fadeInMusic();

				TweenMax.delayedCall(randomInRange(MIN_MUSIC_PLAY_DURATION, MAX_MUSIC_PLAY_DURATION), function() {
					this.fadeOutMusic();

					TweenMax.delayedCall(randomInRange(MIN_MUSIC_PLAY_COOLDOWN, MAX_MUSIC_PLAY_COOLDOWN), function() {

						this.playNextTrack();
					}, null, this);
				}, null, this);
			}, this));
		},

		fadeOutMusic:function() {
			TweenMax.to(this, STATIC_FADE_DURATION, { staticFadePercent:1, onUpdate:$.proxy(function(){
				this.updateSoundVolumes(this.staticFadePercent);
			}, this) });
		},

		fadeInMusic:function() {
			TweenMax.to(this, STATIC_FADE_DURATION, { staticFadePercent:0, onUpdate:$.proxy(function(){
				this.updateSoundVolumes(this.staticFadePercent);
			}, this) });
		},

		updateSoundVolumes:function(fadePercent) {
			this.staticSound.setVolume(lerp(STATIC_MIN_VOLUME, STATIC_MAX_VOLUME, fadePercent));
			if (this.playingSound) {
				this.playingSound.setVolume(lerp(MUSIC_MIN_VOLUME, MUSIC_MAX_VOLUME, 1 - fadePercent));
			}
		}
	}
})();