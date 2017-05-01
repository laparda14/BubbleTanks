function NPC(origX, origY, id, clr){
	Character.call(this, origX, origY, id, clr);
	this.base = new Ball(origX, origY, 1.5, this.material);
	this.turret = new Turret({bulletSpeed: .3, rotationSpeed: 20, delay: 30, baseOffset: 1.5, diameter: .7});
}

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.input = function(){
	this.turret.rotate(1);
	this.tryShoot();
};