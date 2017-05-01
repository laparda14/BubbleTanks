function Ball(origx, origy, rds, material){
	//translation
	this.x = origx;
	this.y = origy;
	this.dx = 0;
	this.dy = 0;

	//scale
	this.scale = [rds,rds,rds];
	this.radius = rds;

	//material
	this.material = material;

	this.move = function(){
		var worldEdge = 100;
	    if(this.x + this.dx - this.scale[0] < -worldEdge){						//left wall
	    	this.dx = Math.abs(this.dx);
	    }
	    if(this.x + this.dx + this.scale[0] > worldEdge) {	//right wall
	        this.dx = -Math.abs(this.dx);
	    }
	    if(this.y + this.dx - this.scale[1] < -worldEdge){						//upper wall
	    	this.dy = Math.abs(this.dy);
	    }
	    if(this.y + this.dx + this.scale[1] > worldEdge) {	//lower wall
	        this.dy = -Math.abs(this.dy);
	    }

	    //moving
	    this.x += this.dx;
	    this.y += this.dy;
	}

	this.getModel = function(){
		var scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);
        var translationMatrix = translate(this.x, this.y, 0);        
        var overallModelMatrix = mult(translationMatrix, scaleMatrix); //removed rotation for spheres

        var model = {
        	modelMatrix: overallModelMatrix,
        	material: this.material
        }
        return model;
	}
}