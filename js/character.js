function Character(origX, origY, id, clr){
	this.id = id;
	this.bullets = new BulletGroup({});
	this.lives = 3;
	
	this.material = {
		ambient: clr,
		diffuse: clr,
		specular:color.white,
		shininess: 20.0
	};	//material for everything in the character
	this.base;
}

Character.prototype.getModels = function(){
	var modelMatrices = [];

	modelMatrices = modelMatrices.concat(this.base.getModel());
    modelMatrices = modelMatrices.concat(this.turret.getModel(this.base.x, this.base.y, this.base.material));
    var bulletModels = this.bullets.getModels();
   	modelMatrices = modelMatrices.concat(bulletModels);

    return modelMatrices;
}

Character.prototype.tryShoot = function(){
	if(this.turret.trigger()){
		var bullet = this.turret.getShotBullet(this.base.x, this.base.y, this.base.material);
		this.bullets.push(bullet);
		return true;
	}
	return false;
}

Character.prototype.move = function(){
    this.base.move();
    this.bullets.move();
}