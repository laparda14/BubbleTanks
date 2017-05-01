function Player(origX, origY, ctx, id, options){
	Character.call(this, origX, origY, ctx, id, options);

	this.turret = new Turret(ctx, {});
	this.keyMap = options.keyMap;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.input = function(keys){
	this.base.dx = 0;
	this.base.dy = 0;

	//check Pressed keys
	for (var key in keys) {
        if (!keys.hasOwnProperty(key)) continue;
        if (key == this.keyMap.left) {		//left/a
            this.base.dx -= this.moveSpeed;
        }
        else if (key == this.keyMap.right) {	//right/d
            this.base.dx += this.moveSpeed;
        }
        
        if (key == this.keyMap.up) {			//up/w
            this.base.dy -= this.moveSpeed;
        }
        else if (key == this.keyMap.down) {	//down/s
           	this.base.dy += this.moveSpeed;
        }

        if(key == this.keyMap.cw){			//q
        	this.turret.rotate(-1);
        }
        if(key == this.keyMap.ccw){			//e
        	this.turret.rotate(1);
        }

        if(key == this.keyMap.shoot){		//space
        	this.tryShoot();
        }
    }
}