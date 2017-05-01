function Ball(origx, origy, ctx, rds, options){
	const maxSpeed = 10;
	const context = ctx;
	this.color = options.color || "gray";

	this.radius = rds;

	this.x = origx;
	this.y = origy;
	this.dx = 0;
	this.dy = 0;

	this.move = function(){
		//wall collision detection
	    const wallOffset = {
	    	x: 0,
	    	y: maxSpeed/2
	    }

	    if(this.x + this.dx - this.radius < 0 + wallOffset.x){						//left wall
	    	this.dx = Math.abs(this.dx);
	    }
	    if(this.x + this.dx + this.radius > context.canvas.width - wallOffset.x) {	//right wall
	        this.dx = -Math.abs(this.dx);
	    }
	    if(this.y + this.dx - this.radius < 0 + wallOffset.y){						//upper wall
	    	this.dy = Math.abs(this.dy);
	    }
	    if(this.y + this.dx + this.radius > context.canvas.height - wallOffset.y) {	//lower wall
	        this.dy = -Math.abs(this.dy);
	    }

	    //moving
	    this.x += this.dx;
	    this.y += this.dy;
	}

	this.render = function(){
		context.beginPath();
	    context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	    context.fillStyle = this.color;
	    context.fill();
	    context.closePath();
	}
}