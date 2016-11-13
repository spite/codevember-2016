function ShaderTexture( renderer, shader, width, height ) {

	this.renderer = renderer;
	this.shader = shader;
	this.orthoScene = new THREE.Scene();
	this.fbo = new THREE.WebGLRenderTarget( width, height, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping
	} );
	this.orthoCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, .00001, 1000 );
	this.orthoQuad = new THREE.Mesh( new THREE.PlaneBufferGeometry( width, height ), this.shader );
	this.orthoScene.add( this.orthoQuad );
	this.texture = this.fbo.texture;

}

ShaderTexture.prototype.render = function() {

	this.renderer.render( this.orthoScene, this.orthoCamera, this.fbo );

}
