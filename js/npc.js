//immobile, sprays bullets in all directions
function NPC1(origX, origY){
	id = -1
	Character.call(this, origX, origY, id, color.brown);
	this.turret = new Turret({bulletSpeed: .2, rotationSpeed: 10, delay: 80, baseOffset: 1.7, diameter: .8});
	this.base = new Ball(origX, origY, 1.7, this.material);
	this.moveSpeed = .03;
}

NPC1.prototype = Object.create(Character.prototype);
NPC1.prototype.constructor = NPC1;

NPC1.prototype.input = function(options){
	this.moveTowards(options.x, options.y);
	this.tryShoot();
	this.turret.rotate(1);
};

//slow, aims at player w/single bullets
function NPC2(origX, origY){
	id = -1
	Character.call(this, origX, origY, id, color.black);
	this.turret = new Turret({bulletSpeed: 1, rotationSpeed: 1, delay: 250, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .06;
}

NPC2.prototype = Object.create(Character.prototype);
NPC2.prototype.constructor = NPC2;

//to aim: checks aim, rotates, checks aim, rotates back
//not very elegant code to have a NPC aim at a player
NPC2.prototype.input = function(options){
	this.moveTowards(options.x, options.y);

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

//three-bullet spread, medium speed
function NPC3(origX, origY){
	id = -3
	Character.call(this, origX, origY, id, color.green);
	this.turret = new Turret({bulletSpeed: .4, rotationSpeed: 20, delay: 10, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .15;
}

NPC3.prototype = Object.create(Character.prototype);
NPC3.prototype.constructor = NPC3;

NPC3.prototype.input = function(options){
	this.moveTowards(options.x, options.y);

	if(this.getAngleFromTarget(options.x, options.y) < 40){
		this.tryShoot();	
	}
	this.turret.rotate(1);
};

//runs towards player to ram them, fast
function NPC4(origX, origY){
	id = -4
	Character.call(this, origX, origY, id, color.yellow);
	this.turret = new Turret({bulletSpeed: .25, rotationSpeed: 20, delay: 10, baseOffset: 1.5, diameter: .7});
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.moveSpeed = .25;
}

NPC4.prototype = Object.create(Character.prototype);
NPC4.prototype.constructor = NPC3;

NPC4.prototype.input = function(options){
	if(this.getAngleFromTarget(options.x, options.y) < 20){
		this.tryShoot();
	}
	this.turret.rotate(1);
	this.moveTowards(options.x, options.y);
};