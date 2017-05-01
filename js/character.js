function Character(origX, origY, ctx, id, options){
	this.id = id;
	this.base = new Ball(origX, origY, ctx, 15, {color: options.color});
	this.bullets = new BulletGroup({});
	
	this.moveSpeed = 5 || options.moveSpeed;
	
	this.lives = 3;
	this.context = ctx;
}

Character.prototype.render = function(){
    this.turret.render(this.base.x, this.base.y);
    this.base.render();
    this.bullets.render();
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