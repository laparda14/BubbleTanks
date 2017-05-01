function Character(origX, origY, id, moveSpeed){
	this.id = id;
	this.base = new Ball(origX, origY, 1);
	this.bullets = new BulletGroup({});
	this.lives = 3;
	this.moveSpeed = moveSpeed;
}

Character.prototype.getModelMatrices = function(){
	var modelMatrices = [];

    var turretModelMatrix = this.turret.getModelMatrix(this.base.x, this.base.y);
    modelMatrices = modelMatrices.concat({modelMatrix: turretModelMatrix});
    var baseModelMatrix = this.base.getModelMatrix();
    modelMatrices = modelMatrices.concat({modelMatrix: baseModelMatrix});
    var bulletModelMatrices = this.bullets.getModelMatrices();
    if(bulletModelMatrices.length > 0){
    	modelMatrices = modelMatrices.concat(bulletModelMatrices);
    }

    return modelMatrices;
}

Character.prototype.tryShoot = function(){
	if(this.turret.trigger()){
		var bullet = this.turret.getShotBullet(this.base.x, this.base.y, this.base.color);
		this.bullets.push(bullet);
		return true;
	}
	return false;
}

Character.prototype.move = function(){
    this.base.move();
    this.bullets.move();
}