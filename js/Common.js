document.getElementById( 'moreDetails' ).addEventListener( 'click', function( e ) {
	document.getElementById( 'details' ).classList.toggle( 'hidden' );
});

function addFullscreenShortcut( element, callback ) {
	window.addEventListener( 'keydown', function( e ) {
		if( e.keyCode === 70 ) {
			element.webkitRequestFullscreen();
			callback();
		}
	} )
}
