// /ˈôdēˌō/

( function() {

function OdeoSoundCloudPlayer( id, odeo ) {

	this.id = id;
	this.odeo = odeo;

	SC.initialize({
		client_id: this.id
	});

	this.audio = document.createElement( 'audio' );
	this.audio.loop = true;
	this.audio.autoplay = true;
	this.audio.crossOrigin = '';

	this.songSource = this.odeo.context.createMediaElementSource( this.audio );
	this.songSource.connect( this.odeo.analyser );
	this.songSource.connect( this.odeo.context.destination );

}

OdeoSoundCloudPlayer.prototype.getSong = function( songURL ) {

	SC.resolve( songURL ).then( function( song ){

		console.log( song );
		//songInfo.innerHTML = '<p><b><a href="' + song.permalink_url + '" >' + song.title + '</a> <a href="#" id="pauseBtn" >PAUSE</a></b><br/><a href="' + song.user.permalink_url + '">' + song.user.username + '</a></p>'

		this.audio.src = song.stream_url + "?client_id=" + this.id;

		this.songSource.connect( this.odeo.analyser );
		this.songSource.connect( this.odeo.context.destination );
		//songPanel.classList.remove( 'hidden' );

		/*document.getElementById( 'pauseBtn' ).addEventListener( 'click', function( e ) {
			if( audio.paused ) {
				this.textContent = 'PAUSE';
				audio.play();
			} else {
				this.textContent = 'PLAY';
				audio.pause();
			}
			e.preventDefault();
		});

		var baseUrl = 'https://www.clicktorelease.com/code/pumpkin-jam'
		var url = baseUrl + '#p=' + PUMPKINS + '&u=' + encodeURIComponent( songURL );
		shareFacebookBtn.onclick = function( e ) {

			window.open( 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent( url ), 'facebook-share-dialog', 'width=626,height=436');
			return false;
		}

		shareTwitterBtn.onclick = function( e ) {

			var msg = 'This is my pumpkin jam! ' + url;
			window.open( 'https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent( url ) + '&text=' + encodeURIComponent( msg ), 'twitter-share-dialog', 'width=626,height=436');
			return false;
		}

		requestAnimationFrame( start );*/

	}.bind( this ) );

}

function OdeoMediaPlayer() {

}

function OdeoMicrophone( odeo ) {

	this.microphone = null;
	this.odeo = odeo;

}

OdeoMicrophone.prototype.play = function() {

	navigator.getUserMedia( { audio: true }, function( stream ) {

		this.microphone = this.odeo.context.createMediaStreamSource( stream );
		this.microphone.connect( this.odeo.analyser );

	}.bind( this ),
	function() {

	} );

}

function Odeo( opts ){

	this.options = opts || {};

	this.context = new AudioContext();
	this.analyser = this.context.createAnalyser();
	this.analyser.fftSize = this.options.fftSize || 256;
	this.frequencyData = new Uint8Array( this.analyser.frequencyBinCount );

	this.spectrumTexture = null;

	this.soundCloudPlayer = null;
	this.microphone = null;

}

Odeo.prototype.playMedia = function() {

}

Odeo.prototype.useMicrophone = function() {

	if( !this.microphone ) this.microphone = new OdeoMicrophone( this );
	this.microphone.play();

}

Odeo.prototype.playSoundCloud = function( url ) {

	if( !this.soundCloudPlayer ) this.soundCloudPlayer = new OdeoSoundCloudPlayer( this.options.soundCloudId, this );
	this.soundCloudPlayer.getSong( url );

}

Odeo.prototype.getSpectrumTexture = function() {

	this.spectrumTexture = new THREE.DataTexture( this.frequencyData, 1 * this.frequencyData.length, 1, THREE.LuminanceFormat );
	this.spectrumTexture.minFilter = THREE.NearestFilter;
	this.spectrumTexture.magFilter = THREE.NearestFilter;
	this.spectrumTexture.needsUpdate = true;

	return this.spectrumTexture;

}

Odeo.prototype.update = function() {

	this.analyser.getByteFrequencyData( this.frequencyData );
	if( this.spectrumTexture ) this.spectrumTexture.needsUpdate = true;
	//kick.onUpdate();

}

window.Odeo = Odeo;

} )();