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

	//defined in derived classes
	this.base;
	this.moveSpeed;
	this.dbRef = firebase.database().ref('players/' + this.id);
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

Character.prototype.moveTowards = function(x,y){
	var dx = x - this.base.x;
	var dy = y - this.base.y;
	this.base.x += this.moveSpeed * Math.sign(dx);
	this.base.y += this.moveSpeed * Math.sign(dy);
}

//calculate the angle the turret is off from the target using dot product
Character.prototype.getAngleFromTarget = function(x,y){
	var dx = x - this.base.x;
	var dy = -(y - this.base.y);
	var targetDistance = Math.sqrt(dx * dx + dy * dy);
	var targetVector = vec2(dx/targetDistance, dy/targetDistance);	//normalized vector from npc to target

	var turretAngle = this.turret.getAngle();
	var turretVector = vec2(Math.cos(degreesToRadians(turretAngle)), Math.sin(degreesToRadians(turretAngle)));	//normalized vector of where npc turret is pointing

	var dTheta = radiansToDegrees(Math.acos(targetVector[0] * turretVector[0] + targetVector[1] * turretVector[1]))
	return dTheta;
}