var id = 'b1275b704badf79d972d51aa4b92ea15';

SC.initialize({
	client_id: id
});

if( 'webkitAudioContext' in window ) {
	var AudioContext = webkitAudioContext;
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var audio = document.createElement( 'audio' );
audio.loop = true;
audio.autoplay = true;
audio.crossOrigin = '';
var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 256;
var frequencyData = new Uint8Array( analyser.frequencyBinCount );

var songSource = context.createMediaElementSource( audio );
songSource.connect( analyser );
songSource.connect( context.destination );

var kick = new Kick({
	frequency: [ 5, 20 ],
	decay: 0.04,
	onKick: function() {
		lighting = 1;
	},
	offKick: function() {
		lighting *= .95;
	}
});
kick.on();

var spectrumTexture = new THREE.DataTexture( frequencyData, .5 * frequencyData.length, 1, THREE.LuminanceFormat );
spectrumTexture.minFilter = THREE.NearestFilter;
spectrumTexture.magFilter = THREE.NearestFilter;
spectrumTexture.needsUpdate = true;

var microphone;

function resetSound() {
	if( microphone ) {
		microphone.disconnect();
	}
	if( songSource ) {
		songSource.disconnect();
	}
}

var songPanel = document.getElementById( 'songPanel' );
var songInfo = document.getElementById( 'songInfo' );
var sharePanel = document.getElementById( 'sharePanel' );

function getSong( songURL ) {
	SC.resolve( songURL ).then( function(song){
		songInfo.innerHTML = '<p><b><a href="' + song.permalink_url + '" >' + song.title + '</a> <a href="#" id="pauseBtn" >PAUSE</a></b><br/><a href="' + song.user.permalink_url + '">' + song.user.username + '</a></p>'
		audio.src = song.stream_url + "?client_id=" + id;
		songSource.connect( analyser );
		songSource.connect( context.destination );
		songPanel.classList.remove( 'hidden' );

		document.getElementById( 'pauseBtn' ).addEventListener( 'click', function( e ) {
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

		requestAnimationFrame( start );
	});
}

function getMicrophone() {

	if( microphone ) {
		microphone.connect( analyser );
		return;
	}

	navigator.getUserMedia( { audio: true }, function(stream) {

		microphone = context.createMediaStreamSource(stream);
		microphone.connect( analyser );
		start();

	},
	function(err) {
	} );

}
