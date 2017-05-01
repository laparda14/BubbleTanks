function NPC(origX, origY, id, options){
	Character.call(this, origX, origY, id, options);

	this.turret = new Turret({bulletSpeed: .3, rotationSpeed: 20, delay: 30});
}

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.input = function(){
	this.turret.rotate(1);
	this.tryShoot();
};