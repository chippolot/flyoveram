(function(){
	
	this.Radio = function() { this.initialize(); };

	Radio.prototype = {
		initialize:function() {
			this.tracklist = [];

			this.maxVolume = 80;
			this.minVolume = 5;

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
			$.ajax({
			  url: "http://flyover-am.herokuapp.com/randomtracks",
			  type: "GET",
			  dataType: "json"
			}).done(function(result){
				this.tracklist = result.trackUrls;
				this.tracklist = _.shuffle(this.tracklist);
				callback();
			});
		},

		playNextTrack:function() {

			// If we're out of tracks, grab a new set
			if (this.tracklist.length == 0) {
				this.getRandomTracks($.proxy(function(){
					console.log(this.tracklist);
					this.playNextTrack();
				}, this));
				return;
			}

			// Grab the first track on the list
			var trackUrl = this.tracklist.shift();
		},

		fadeOutMusic:function() {
			this.staticSound.fadeTo(this.maxVolume);
		},

		fadeInMusic:function() {
			this.staticSound.fadeTo(this.minVolume);
		}
	}
})();