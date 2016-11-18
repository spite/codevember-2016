(function(){

function Boids( opts ) {

	this.boids = [];
	this.opts = opts || {};

	for( var j = 0; j < this.opts.boids; j++ ) {

		this.boids.push({
			position: new THREE.Vector3(
				Maf.randomInRange( -50, 50 ),
				0,
				Maf.randomInRange( -50, 50 )
			),
			centerVelocity: new THREE.Vector3(),
			alignmentVelocity: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			orientation: new THREE.Quaternion( 0, 0, 0, 1 )
		})

	}

}

var tmpVector = new THREE.Vector3();

Boids.prototype.update = function() {

	var center = new THREE.Vector3();
	for( var i = 0; i < this.boids.length; i++ ) {
		center.add( this.boids[ i ].position );
	}
	center.multiplyScalar( 1 / this.boids.length );

	for( var i = 0; i < this.boids.length; i++ ) {

		tmpVector.copy( center );
		tmpVector.sub( this.boids[ i ].position );
		tmpVector.normalize();

		this.boids[ i ].centerVelocity.copy( tmpVector );

		this.boids[ i ].alignmentVelocity.set( 0, 0, 0 );

		for( var j = 0; j < this.boids.length; j++ ) {

			tmpVector.copy( this.boids[ j ].position );
			var distance = tmpVector.distanceTo( this.boids[ i ].position );

			if( distance < 10 ) {

				tmpVector.copy( this.boids[ j ].position );
				tmpVector.sub( this.boids[ i ].position );
				this.boids[ i ].alignmentVelocity.add( tmpVector );

			}

		}

		this.boids[ i ].alignmentVelocity.normalize();

		this.boids[ i ].velocity.copy( this.boids[ i ].centerVelocity );
		this.boids[ i ].velocity.add( this.boids[ i ].alignmentVelocity );
		this.boids[ i ].velocity.multiplyScalar( .1 );

		this.boids[ i ].position.add( this.boids[ i ].velocity );

	}

}

window.Boids = Boids;

})();
