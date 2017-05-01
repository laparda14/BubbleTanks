function Turret(ctx, options){

	var angle = options.angle || 0;
	var length = options.length || 10;
	var width = options.width || 25;
	var color = options.color || "black";
	var bulletSpeed = options.bulletSpeed || 8;
	var rotationSpeed = options.rotationSpeed || 4;
	
	var delay = options.delay || 200;
	var canShoot = true;
	var context = ctx;

	this.render = function(x, y){
		context.save();

	    context.translate(x, y);
	    context.rotate(degreesToRadians(angle)); 
	    context.translate(-x, -y);

	   	context.fillStyle = color;
		context.fillRect(x, y - length/2, width, length);

	    context.restore();
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
			x: basex + width * Math.cos(degreesToRadians(angle)),
			y: basey + width * Math.sin(degreesToRadians(angle))
		}
		var bullet = new Ball(bulletLocation.x, bulletLocation.y, context, 5, {color: baseColor});

		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(angle));
		bullet.dy = bulletSpeed * Math.sin(degreesToRadians(angle));
		
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