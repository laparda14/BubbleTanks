function NPC1(origX, origY, id, clr){
	Character.call(this, origX, origY, id, clr);
	this.turret = new Turret({bulletSpeed: .2, rotationSpeed: 10, delay: 60, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = 0;
}

NPC1.prototype = Object.create(Character.prototype);
NPC1.prototype.constructor = NPC1;

NPC1.prototype.input = function(options){
	this.tryShoot();
	this.turret.rotate(1);
};

function NPC2(origX, origY, id, clr){
	Character.call(this, origX, origY, id, clr);
	this.turret = new Turret({bulletSpeed: .6, rotationSpeed: 1, delay: 200, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .05;
}

NPC2.prototype = Object.create(Character.prototype);
NPC2.prototype.constructor = NPC2;

//to aim: checks aim, rotates, checks aim, rotates back
//not very elegant code to have a NPC aim at a player
NPC2.prototype.input = function(options){
	var dx = options.x - this.base.x;
	var dy = options.y - this.base.y;
	this.base.x += this.moveSpeed * Math.sign(dx);
	this.base.y += this.moveSpeed * Math.sign(dy);

	var dThetaOrig1 = this.getAngleFromTarget(options.x, options.y);
	this.turret.rotate(1);
	var dThetaCW = this.getAngleFromTarget(options.x, options.y);
	this.turret.rotate(-1);

	if(dThetaCW < dThetaOrig1){
		this.turret.rotate(1);
	}
	else{
		this.turret.rotate(-1);
	}

	this.tryShoot();
};

function NPC3(origX, origY, id, clr){
	Character.call(this, origX, origY, id, clr);
	this.turret = new Turret({bulletSpeed: .4, rotationSpeed: 20, delay: 10, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .1;
}

NPC3.prototype = Object.create(Character.prototype);
NPC3.prototype.constructor = NPC3;

NPC3.prototype.input = function(options){
	var dx = options.x - this.base.x;
	var dy = options.y - this.base.y;
	this.base.x += this.moveSpeed * Math.sign(dx);
	this.base.y += this.moveSpeed * Math.sign(dy);

	if(this.getAngleFromTarget(options.x, options.y) < 30){
		this.tryShoot();	
	}
	this.turret.rotate(1);
};

function NPC4(origX, origY, id, clr){
	Character.call(this, origX, origY, id, clr);
	this.turret = new Turret({bulletSpeed: .2, rotationSpeed: 20, delay: 10, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .2;
}

NPC4.prototype = Object.create(Character.prototype);
NPC4.prototype.constructor = NPC3;

NPC4.prototype.input = function(options){
	var dx = options.x - this.base.x;
	var dy = options.y - this.base.y;
	this.base.x += this.moveSpeed * Math.sign(dx);
	this.base.y += this.moveSpeed * Math.sign(dy);
	if(this.getAngleFromTarget(options.x, options.y) < 30){
		this.tryShoot();
	}
	this.turret.rotate(1);
};