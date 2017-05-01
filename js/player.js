function Player(origX, origY, id, moveSpeed, clr, keyMap){
	Character.call(this, origX, origY, id, clr);

    this.moveSpeed = moveSpeed;
	this.turret = new Turret({});
	this.keyMap = keyMap;
    this.base = new Ball(origX, origY, 1, this.material);
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.input = function(keys){
	this.base.dx = 0;
	this.base.dy = 0;

    var baseMoved = false;

	//check Pressed keys
	for (var key in keys) {
        if (!keys.hasOwnProperty(key)) continue;
        if (key == this.keyMap.left){		//left/a
            this.base.dx -= this.moveSpeed;
            baseMoved = true;
        }
        else if (key == this.keyMap.right){	//right/d
            this.base.dx += this.moveSpeed;
            baseMoved = true;
        }
        
        if (key == this.keyMap.up){			//up/w
            this.base.dy += this.moveSpeed;
            baseMoved = true;
        }
        else if (key == this.keyMap.down){	//down/s
           	this.base.dy -= this.moveSpeed;
            baseMoved = true;
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

    if(baseMoved){
        this.base.move();
    }
}

Player.prototype.move = function(){
    //this.base.move(); //called in input function, so commented out here
    this.bullets.move();  //uncomment after implemented
}