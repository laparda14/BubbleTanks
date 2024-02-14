function Turret(options){
	var angle = options.angle || 0;
	var bulletSpeed = options.bulletSpeed || .8;
	var rotationSpeed = options.rotationSpeed || 2.5;
	
	var delay = options.delay || 0;
	var canShoot = true;

	//turret physical properties
	var diameter = options.diameter || .4;
	this.scale = [diameter, diameter, diameter];
	this.baseOffset = options.baseOffset || 1.1;

	this.getModel = function(basex, basey, basematerial){
        //NOTE: rotation of points would require recomputation of rotated normals
        //so provide a model matrix for a spherical turret, without rotation.
        var scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);
        var translationMatrix = translate(
        	this.baseOffset * Math.cos(degreesToRadians(angle)) + basex, 
        	this.baseOffset * -Math.sin(degreesToRadians(angle)) + basey, 
        	0
        );
        var overallModelMatrix = mult(translationMatrix, scaleMatrix);

        var model = {
        	modelMatrix: overallModelMatrix,
        	material: basematerial
        }
        return model;
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
	this.getShotBullet = function(basex, basey, baseMaterial){
		var bulletLocation = {
			x: basex + this.baseOffset * Math.cos(degreesToRadians(angle)),
			y: basey - this.baseOffset * Math.sin(degreesToRadians(angle))
		};

		var bullet = new Ball(bulletLocation.x, bulletLocation.y, .4, baseMaterial);

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
