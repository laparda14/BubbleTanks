function BulletGroup(options){
	this.bullets = [];
	var bulletsShot = 0;
	var bulletLifetime = options.bulletLifetime || 500;

	this.push = function(bullet){
		this.bullets.push(bullet);
		bullet.lifetime = bulletLifetime;
		bulletsShot--;
	}
	this.getModels = function(){
		var modelMatrices = [];
	    this.bullets.forEach(function(bullet){
	    	modelMatrices = modelMatrices.concat(bullet.getModel());
	    });
	    return modelMatrices;
	}

	this.move = function(){
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].lifetime--;
			if(this.bullets[i].lifetime <= 0){
				this.bullets.splice(i,1);
			}
			else{
	    		this.bullets[i].move();
	    	}
	    };
	}

	this.removeBulletById = function(id){
		this.bullets.splice(id, 1);
	}
}
