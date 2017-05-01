var game = new Game();
game.init();

function Game(){
	var canvas;
	var context;
	var text;

	var players;

	var backgroundMusic;
	var backgroundColor = "white";

	//reference for jquery mouse movement
	//http://stackoverflow.com/questions/7298507/move-element-with-keypress-multiple
	var keys = {};

	this.init = function(){

		//canvas setup
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		context.canvas.width = window.innerWidth * .9;
		context.canvas.height = window.innerHeight * .9;

		//background music setup
		backgroundMusic = new Audio("audio/music.mp3");
		backgroundMusic.loop = true;
		// backgroundMusic.play();

		//keys setup
		$(document).keydown(function(e) {
		    keys[e.keyCode] = true;
		});

		$(document).keyup(function(e) {
		    delete keys[e.keyCode];
		});

		//objects setup
		players = [];
		var p1Controls = {
			left: 65,	//a
			right: 68,	//d
			up: 87,		//w
			down: 83,	//s
			cw: 81,		//q
			ccw: 69,	//e
			shoot: 32	//space
		}
		var p1 = new Player(canvas.width*1/4, canvas.height*1/4, context, 1, {color: "red", keyMap: p1Controls});
		var p2Controls = {
			left: 37,	//arrow keys (on numpad)
			right: 39, 	
			up: 38,
			down: 12,	//clear (5 on numpad)
			cw: 36,		//home
			ccw: 33,	//pgup
			shoot: 40	//down arrow 
		}
		var p2 = new Player(canvas.width*1/4, canvas.height*3/4, context, 2, {color: "blue", keyMap: p2Controls});

		var p3 = new NPC(canvas.width*3/4, canvas.height*1/4, context, 3, {color: "black"});
		var p4 = new NPC(canvas.width*3/4, canvas.height*3/4, context, 4, {color: "green"});

		players.push(p1);
		players.push(p2);
		players.push(p3);
		players.push(p4);
		text = new Text(context);
	  	
		//begin rendering
		render();
	}


	//collision detection between players and bullets (not walls tho)
	function playerBallCollisionDetection(){
		for(var i = 0; i < players.length; i++){		//for each player
			var player = players[i];
			for(var j = 0; j < players.length; j++){	//check each other player/team's bullets
				if(i != j){
					var otherBullets = players[j].bullets.bullets;
					for(var k = 0; k < otherBullets.length; k++){
						var dx = player.base.x - otherBullets[k].x;
						var dy = player.base.y - otherBullets[k].y;
						var dr2 = dx * dx + dy * dy;
						var r1 = player.base.radius;
						var r2 = otherBullets[k].radius;
						var rsq = (r1 + r2) * (r1 + r2);
						if(rsq >= dr2){
							players[i].lives--;
							players[j].bullets.removeBulletById(k);
							if(players[i].lives <= 0){
								players.splice(i, 1);		//player hit!!!	
							}
						}
					}
				}
			}
		}
	}	

	function render(){
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		playerBallCollisionDetection();

		for(var i = 0; i < players.length; i++){
			players[i].input(keys);
			players[i].move();
			players[i].render();
		}

		players.forEach(function(player){
			if(player.id === 1){
				text.drawMiddleTop("Red Player lives: " + player.lives);
			}
			if(player.id === 2){
				text.drawMiddleBottom("Blue Player lives: " + player.lives);
			}
		})	

		requestAnimationFrame(render)
	}
}