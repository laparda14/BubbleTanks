function Floor(){
	this.material = {
		ambient: color.white,
		diffuse: color.white,
		specular:color.white,
		shininess: 20.0
	};	//material for everything in the character

	this.location = [0,0,-5];
	this.scale = [100,100,1];


	this.getModel = function(){
		var scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);
        var translationMatrix = translate(this.location[0], this.location[1], this.location[2]);        
        var overallModelMatrix = mult(translationMatrix, scaleMatrix); //removed rotation for spheres

        var model = {
        	modelMatrix: overallModelMatrix,
        	material: this.material
        }
        return model;
	}
}