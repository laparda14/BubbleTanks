function Turret(options){
	var angle = options.angle || 0;
	var bulletSpeed = options.bulletSpeed || .8;
	var rotationSpeed = options.rotationSpeed || 1;
	
	var delay = options.delay || 200;
	var canShoot = true;

	//turret physical properties
	var diameter = options.diameter || .4;
	this.scale = [diameter, diameter, diameter];
	this.baseOffset = options.baseOffset || 1.1;

	this.getModelMatrix = function(x, y){
		// var scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);
        // var translationMatrix = translate(this.baseOffset, 0, 0);   
        // var rotationMatrix = rotateZ(angle);
        // var baseTranslationMatrix = translate(x, y, 0);
        // var overallModelMatrix = mult(baseTranslationMatrix, mult(rotationMatrix, mult(translationMatrix, scaleMatrix)));

        //NOTE: above code provides a model matrix for a generalized turret, but rotation of points would require recomputation of rotated normals
        //therefore, below code provides a model matrix for a spherical turret, without rotation, so that normals need not be recomputed
        var scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);
        var translationMatrix = translate(
        	this.baseOffset * Math.cos(degreesToRadians(angle)) + x, 
        	this.baseOffset * -Math.sin(degreesToRadians(angle)) + y, 
        	0
        );
        var overallModelMatrix = mult(translationMatrix, scaleMatrix);
        return overallModelMatrix;
	}

	//can it shoot? If so, set the delay so it doesn't for a while
	this.trigger = function(){
		if(!canShoot){
			return false;
		}

		canShoot = false;
		setTimeout(function(){
			canShoot = true;
		}, delay);
		return true;
	}

	//wow it shot. Now return the bullet
	this.getShotBullet = function(basex, basey, baseColor){
		var bulletLocation = {
			x: basex + this.baseOffset * Math.cos(degreesToRadians(angle)),
			y: basey - this.baseOffset * Math.sin(degreesToRadians(angle))
		};

		var bullet = new Ball(bulletLocation.x, bulletLocation.y, .4);

		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(angle));
		bullet.dy = -bulletSpeed * Math.sin(degreesToRadians(angle));
		
		return bullet;
	}

	this.getAngle = function(){
		return angle;
	}

	this.setAngle = function(newAngle){
		angle = newAngle;
	}

	this.rotate = function(direction){
		angle = (angle + direction * rotationSpeed) % 360;
	}
}