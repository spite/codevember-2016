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
	btn.style = 'position: absolute; right: 20px; bottom: 20px; border: 1px solid white; z-index: 1000; width: 28px; height: 28px; cursor: pointer; text-align: center; line-height: 24px';
	document.body.appendChild( btn );
	btn.addEventListener( 'click', goFS );
}
