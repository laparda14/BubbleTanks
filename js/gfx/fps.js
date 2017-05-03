//simple fps counter, courtesy of Graphics textbook pickCube5.js
function FPS(){
	var t1, t2;
	var previousFps = [0,0,0,0,0];
	t1 = new Date();

	this.update = function(){
		t2 = new Date();
		var fps = Math.floor(1000/(t2.valueOf()-t1.valueOf())+0.5);
		previousFps.push(fps);
		previousFps.shift();
		t1 = t2;
	}

	this.get = function(){
		return Math.round((previousFps[0] + previousFps[1] + previousFps[2])/3);
	}
}

