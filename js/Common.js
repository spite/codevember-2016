document.getElementById( 'moreDetails' ).addEventListener( 'click', function( e ) {
	document.getElementById( 'details' ).classList.toggle( 'hidden' );
});

function addFullscreenShortcut( element, callback ) {

	function goFS() {

		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
		callback();

	}

	window.addEventListener( 'keydown', function( e ) {
		if( e.keyCode === 70 ) {
			goFS();
		}
	} )
	var btn = document.createElement( 'div' );
	btn.textContent = '↗';
	btn.className = 'fullscreen-button'
	document.body.appendChild( btn );
	btn.addEventListener( 'click', goFS );
}
