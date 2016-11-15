function MeshCustomMaterial (parameters) {
	THREE.MeshStandardMaterial.call( this );
	this.uniforms = THREE.UniformsUtils.merge([
		THREE.UniformsLib.common,
		THREE.UniformsLib.aomap,
		THREE.UniformsLib.lightmap,
		THREE.UniformsLib.emissivemap,
		THREE.UniformsLib.bumpmap,
		THREE.UniformsLib.normalmap,
		THREE.UniformsLib.displacementmap,
		THREE.UniformsLib.roughnessmap,
		THREE.UniformsLib.metalnessmap,
		THREE.UniformsLib.fog,
		THREE.UniformsLib.lights,
		{
			emissive : { value: new THREE.Color( 0x000000 ) },
			roughness: { value: 0 },
			metalness: { value: 1 },
			envMapIntensity : { value: 1 },
			time: { value: 0 },
			distortion: { value: 0 }
			}
		]);

	this.vertexShader = parameters.vertexShader;
	this.fragmentShader = parameters.fragmentShader;
	this.type = 'MeshCustomMaterial';

	this.setValues(parameters);
}

MeshCustomMaterial.prototype = Object.create( THREE.MeshStandardMaterial.prototype );
MeshCustomMaterial.prototype.constructor = MeshCustomMaterial;
MeshCustomMaterial.prototype.isMeshStandardMaterial = true;

MeshCustomMaterial.prototype.copy = function ( source ) {
	THREE.MeshStandardMaterial.prototype.copy.call( this, source );
	this.uniforms = THREE.UniformsUtils.clone(source.uniforms);
	setFlags(this);
	return this;
};
