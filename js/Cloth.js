/*
 * Cloth Simulation using a relaxed constrains solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

/* 20 x 10 restDist = 30 --> good config
var DAMPING = 0.07;
var DRAG = 1 - DAMPING;
var MASS = .03;
var restDistance = 30;
var GRAVITY = 981 * 1.4;
*/

var DAMPING = 0.07;
var DRAG = 1 - DAMPING;
var MASS = .05;
var restDistance = 36;
var GRAVITY = 981 * 1.4;;

var clothProperties = {'damping': DAMPING,'drag': DRAG,'mass': MASS };

var xSegs = 50; //
var ySegs = 40; //

var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

var cloth = new Cloth(xSegs, ySegs);

var gravity = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar(clothProperties.mass);


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];
var pinOffset = {x:0,y:0,z:0,'animationVel': 1000,'circularAnimation':false};
var pinBend = {'amount':1,'periodicity':1000};

//var windToggle = true;
var windStrength = 2;
var windForce = new THREE.Vector3(0,0,0);

var tmpForce = new THREE.Vector3();

var lastTime;


function plane(width, height) {

	return function(u, v) {
		var x = (u-0.5) * width;
		var y = (v+0.5) * height;
		var z = 0;

		return new THREE.Vector3(x, y, z);
	};
}

function Particle(x, y, z, mass) {
	this.position = clothFunction(x, y); // position
	this.previous = clothFunction(x, y); // previous
	this.original = clothFunction(x, y);
	this.a = new THREE.Vector3(0, 0, 0); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = new THREE.Vector3();
	this.tmp2 = new THREE.Vector3();
}

// Force -> Acceleration
Particle.prototype.addForce = function(force) {
	this.a.add(
		this.tmp2.copy(force).multiplyScalar(this.invMass)
	);
};


// Performs verlet integration
Particle.prototype.integrate = function(timesq) {
	var newPos = this.tmp.subVectors(this.position, this.previous);
	newPos.multiplyScalar(clothProperties.drag).add(this.position);
	newPos.add(this.a.multiplyScalar(timesq));

	this.tmp = this.previous;
	this.previous = this.position;
	this.position = newPos;

	this.a.set(0, 0, 0);
}


var diff = new THREE.Vector3();
var tmpP1 = new THREE.Vector3();

function satisifyConstrains(p1, p2, distance) {
	//Original function....
	diff.subVectors(p2.position, p1.position);
	var currentDist = diff.length();
	if (currentDist==0) return; // prevents division by 0
	var correction = diff.multiplyScalar(1 - distance/currentDist);
	var correctionHalf = correction.multiplyScalar(0.5);
	p1.position.add(correctionHalf);
	p2.position.sub(correctionHalf);


	//var diff = new THREE.Vector3();
	/*diff.subVectors(p2.position, p1.position);
	var currentDist = diff.length();
	if (currentDist==0) return; // prevents division by 0
	if (currentDist<15) return;
	diff.normalize();

	diff.multiplyScalar(distance);

	tmpP1.set(0,0,0);
	tmpP1.add(p1.position);

	tmpP1.add(diff);

	p2.position.copy(tmpP1);*/
}


function Cloth(w, h) {
	w = w || 10;
	h = h || 10;
	this.w = w;
	this.h = h;

	var particles = [];
	var constrains = [];

	var u, v;

	// Create particles
	for (v=0;v<=h;v++) {
		for (u=0;u<=w;u++) {
			//console.log("Create Particles: ",u/w, v/h);
			particles.push(
				new Particle(u/w, v/h, 0, clothProperties.mass)
			);
		}
	}

	// Structural

	for (v=0;v<h;v++) {
		for (u=0;u<w;u++) {

			constrains.push([
				particles[index(u, v)],
				particles[index(u, v+1)],
				restDistance
			]);

			constrains.push([
				particles[index(u, v)],
				particles[index(u+1, v)],
				restDistance
			]);
		}
	}

	for (u=w, v=0;v<h;v++) {
		constrains.push([
			particles[index(u, v)],
			particles[index(u, v+1)],
			restDistance

		]);
	}

	for (v=h, u=0;u<w;u++) {
		constrains.push([
			particles[index(u, v)],
			particles[index(u+1, v)],
			restDistance
		]);
	}


	// While many system uses shear and bend springs,
	// the relax constrains model seem to be just fine
	// using structural springs.
	// Shear
	// var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


	// for (v=0;v<h;v++) {
	// 	for (u=0;u<w;u++) {

	// 		constrains.push([
	// 			particles[index(u, v)],
	// 			particles[index(u+1, v+1)],
	// 			diagonalDist
	// 		]);

	// 		constrains.push([
	// 			particles[index(u+1, v)],
	// 			particles[index(u, v+1)],
	// 			diagonalDist
	// 		]);

	// 	}
	// }


	this.particles = particles;
	this.constrains = constrains;

	function index(u, v) {
		return u + v * (w + 1);
	}

	this.index = index;

}

function simulate(time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}

	var i, il, particles, particle, pt, constrains, constrain;

	// Aerodynamics forces
	if (wind.enabled) {
		var face, faces = clothGeometry.faces, normal;

		particles = cloth.particles;

		for (i=0,il=faces.length;i<il;i++) {
			face = faces[i];
			normal = face.normal;

			tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
			particles[face.a].addForce(tmpForce);
			particles[face.b].addForce(tmpForce);
			particles[face.c].addForce(tmpForce);
		}
	}

	if(gravity !== 0){
		for (particles = cloth.particles, i=0, il = particles.length;i<il;i++) {
			particle = particles[i];
			particle.addForce(gravity);

			particle.integrate(TIMESTEP_SQ);
		}
	}

	// Start Constrains

	constrains = cloth.constrains,
	il = constrains.length;
	for (i=0;i<il;i++) {
		constrain = constrains[i];
		satisifyConstrains(constrain[0], constrain[1], constrain[2]);
	}

	// Ball Constrains


	/*ballPosition.z = -Math.sin(Date.now()/600) * 90 ; //+ 40;
	ballPosition.x = Math.cos(Date.now()/400) * 70*/

	/*if (sphere.visible)
	for (particles = cloth.particles, i=0, il = particles.length
			;i<il;i++) {
		particle = particles[i];
		pos = particle.position;
		diff.subVectors(pos, ballPosition);
		if (diff.length() < ballSize) {
			// collided
			diff.normalize().multiplyScalar(ballSize);
			pos.copy(ballPosition).add(diff);
		}
	}*/

	// Floor Constains
	/*for (particles = cloth.particles, i=0, il = particles.length
			;i<il;i++) {
		particle = particles[i];
		pos = particle.position;
		if (pos.y < -250) {
			pos.y = -250;
		}
	}*/

	// Pin Constrains
	for (i=0, il=pins.length;i<il;i++) {
		var xy = pins[i];
		var p = particles[xy];
		var o = p.original;
		var ax = ((((1-((2*(i/pins.length)-1)*(2*(i/pins.length)-1)))*1.3)+1)*Math.sin(time/pinBend.periodicity)*pinBend.amount+50)+o.x+pinOffset.x;
		var ay = o.y+pinOffset.y;
		var az = o.z+pinOffset.z;
		if(pinOffset.circularAnimation){
			ax = ax*Math.cos(time/pinOffset.animationVel);
			az = az*Math.sin(time/pinOffset.animationVel);
		}
		cc = new THREE.Vector3(ax, ay, az);
		p.position.copy(cc);
		p.previous.copy(cc);
	}


}
