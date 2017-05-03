function Text(context){
	const defaultOptions = {
		fontSize: 20,
		font: "Arial",
		align: "center",
		color: "white",
		text: "default text",
		x: context.canvas.width/2,
		y: context.canvas.height/2
	}

	function drawText(options){
		var fontSize = options.fontSize || defaultOptions.fontSize;
		var font = options.font || defaultOptions.font;
		
		context.font = fontSize + "px " + font;
		context.textAlign = options.align || defaultOptions.align;
		context.fillStyle = options.color || defaultOptions.color;

		var text = options.text || defaultOptions.text;
		var x = options.x || defaultOptions.x;
		var y = options.y || defaultOptions.y;
		context.fillText(text, x, y);
	}

	this.drawMiddleBottom = function(text){
		const x = context.canvas.width/2;
		const y = context.canvas.height - defaultOptions.fontSize;
		drawText({text: text, x: x, y: y});
	}

	this.drawMiddleTop = function(text){
		const x = context.canvas.width/2
		const y = 0 + defaultOptions.fontSize;
		drawText({text: text, x: x, y: y});
	}

	this.drawMiddleMiddle = function(text){
		drawText({text: text, fontSize: 100});
	}

	this.drawRightBottom = function(text){
		const x = context.canvas.width * .9;
		const y = context.canvas.height - defaultOptions.fontSize;
		drawText({text: text, x: x, y: y});
	}

	this.drawLeftTop = function(text){
		const x = context.canvas.width * .1;
		const y = 0 + defaultOptions.fontSize;
		drawText({text: text, x: x, y: y});
	}
}