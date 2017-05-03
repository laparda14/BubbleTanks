function Spawner(){
	var mapRadius = 100;
	var hasType = [0,0,0,0];
	var theta = 0;

	function getLocation(){
		var distFromCenter = getRandomInt(mapRadius*.3, mapRadius*.7);
		theta = (theta + 100) % 360;

		var x = distFromCenter * Math.cos(degreesToRadians(theta));
		var y = distFromCenter * Math.sin(degreesToRadians(theta));

		return {x: x, y: y};
	}

	this.getNPC = function(){
		var loc = getLocation();

		var type = getRandomInt(1,4);
		if(type === 1){
			return new NPC1(loc.x, loc.y);
		}
		if(type === 2){
			return new NPC2(loc.x, loc.y);
		}
		if(type === 3){
			return new NPC3(loc.x, loc.y);
		}
		if(type === 4){
			return new NPC4(loc.x, loc.y);
		}
		console.log("ERROR: check spawner.getNPC()");
	}
}