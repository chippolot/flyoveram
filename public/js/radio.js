function lerp(start, end, t) {
	return start + (end - start) * t;
}

function randomInRange(min, max) {
	return min + (max - min) * Math.random();
}

var STATIC_FADE_DURATION = 0.75;

var STATIC_MIN_VOLUME = 30;
var STATIC_MAX_VOLUME = 80;

var MUSIC_MIN_VOLUME = 0;
var MUSIC_MAX_VOLUME = 30;

var MIN_MUSIC_PLAY_DURATION = 8;
var MAX_MUSIC_PLAY_DURATION = 15;

var MIN_MUSIC_PLAY_COOLDOWN = 5;
var MAX_MUSIC_PLAY_COOLDOWN = 9;


(function(){
	
	this.Radio = function() { this.initialize(); };

	Radio.prototype = {
		initialize:function() {
			this.tracklist = [];
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
				this.tracklist = result.tracks;
				this.tracklist = _.shuffle(this.tracklist);
				callback();
			}, this));
		},

		playNextTrack:function() {

			// If we're out of tracks, grab a new set
			if (this.tracklist.length == 0) {
				this.getRandomTracks($.proxy(function(){
					this.playNextTrack();
				}, this));
				return;
			}

			// Grab the first track on the list
			var track = this.tracklist.shift();

			// Stream the song
			console.log(":: starting to stream song", track.id)
			soundcloudStream(track.id, {}, $.proxy(function(sound) {

				this.playingSound = sound;
				this.playingSound.play();

				var randomPercent = Math.random();
				var position = randomPercent * track.duration;
				this.playingSound.setPosition(position);

				this.fadeInMusic();

				var playDuration = randomInRange(MIN_MUSIC_PLAY_DURATION, MAX_MUSIC_PLAY_DURATION);
				console.log(":: stopping song in ", playDuration)
				TweenMax.delayedCall(playDuration, function() {
					this.fadeOutMusic();

					var cooldownDuration = randomInRange(MIN_MUSIC_PLAY_COOLDOWN, MAX_MUSIC_PLAY_COOLDOWN);
					console.log(":: starting song in ", cooldownDuration)
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