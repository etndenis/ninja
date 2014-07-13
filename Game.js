
var GAME;

window.onload = function(){
	var canvas = document.getElementById("canvas");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	
	GAME = new Game(canvas)

	
	
	if(GAME.canvas.getContext)
		GAME.ctx = GAME.canvas.getContext("2d");

	GAME.ctx.imageSmoothingEnabled = false;
    GAME.ctx.webkitImageSmoothingEnabled = false;
    GAME.ctx.mozImageSmoothingEnabled = false;



	GAME_loop();

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);
	window.addEventListener("mousedown", onMousedown, false);
	window.addEventListener("mousemove", onMousemove, false);

}

function GAME_loop(){
	if (GAME.state == "game") {
		GAME.ctx.clearRect(0,0,canvas.width,canvas.height)
		for (var i = GAME.bullets.length - 1; i >= 0; i--) {
			var collision = GAME.bullets[i].act();
			if(collision != false){
				GAME.bullets.splice(i,1);
				if (!(collision === true)) {
					GAME.players.splice(collision,1);
				};
			}
		};

		for (var i = GAME.blocks.length - 1; i >= 0; i--) {
			GAME.blocks[i].act();
		};

		for (var i = GAME.players.length - 1; i >= 0; i--) {
			GAME.players[i].act();
			if(GAME.players[i].y>GAME.canvas.height){GAME.players[i] = new Player(GAME.players[i].keys,GAME.players[i].color)}
		};

		

		GAME.flag.act();
	}

	GAME.ui.drawUI(GAME.state)

	requestAnimFrame(GAME_loop)
}




function Game(canvas){
	this.canvas = canvas;
	this.ctx;
	this.state = "menu";
	this.keys = [new Keys(39,37,38,40), new Keys(68,65,87,83)];
	this.players = [new Player(this.keys[0],"green"),new Player(this.keys[1],"purple")];
	this.blocks = [new Block(0,canvas.height-50,canvas.width,20)];
	this.bullets = [];
	this.flag;
	this.images = document.getElementById('rabbit_walk');
	console.log(this.canvas.width/2-120, this.canvas.height/2)
	this.ui = new UI([new Button(this.canvas.width/2-120,this.canvas.height/2,100,50,"1-Player","menu",(this.init.bind(this,1,50,4))),
					new Button(this.canvas.width/2,this.canvas.height/2,100,50,"2-Player","menu",(this.init.bind(this,2,50,3))),
					new Button(this.canvas.width/2+120,this.canvas.height/2,100,50,"3-Player","menu",(this.init.bind(this,3,50,2))),
					new Button(this.canvas.width/2,this.canvas.height/2+10,170,50,"Back to Menu","win",(function(){this.state = "menu"; this.players = [];this.boids = [];}.bind(this)))],
					[new Box(this.canvas.width/2,this.canvas.height/2-60,0,0,"rgb(50,50,50)","rgb(50,50,50)","sharpCorners","menu","Ninja",1.3,"bold 63px Verdana"),
					new Box(this.canvas.width/2,this.canvas.height/2,this.canvas.width,this.canvas.height,"rgb(240,240,240)","rgb(240,240,240)","sharpCorners","menu"),
					new Box(this.canvas.width/2,this.canvas.height/2-60,0,0,"rgb(50,50,50)","rgb(50,50,50)","sharpCorners","win","win",3,"bold 63px Verdana")]);
	for (var i = 20; i >= 0; i--) {
			this.blocks.push(new Block(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*100,Math.random()*70+20));
		};

	for (var i = 3; i >= 0; i--) {
			this.blocks.push(new Block(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*140,Math.random()*370+20));
		};	// Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,text,state)
}

Game.prototype.init = function(){
	this.state = "game";
	var index = Math.floor((this.blocks.length-1)*Math.random());
	this.flag = new Flag(this.blocks[index].x+Math.random()*this.blocks[index].width, this.blocks[index].y)
}

function UI(buttons,boxes){
	this.buttons = buttons||[];
	this.boxes = boxes||[];
}

UI.prototype.drawUI = function(state){

		for (var i = this.boxes.length - 1; i >= 0; i--) {

			if (state == this.boxes[i].state)
				this.boxes[i].draw();
		};

		for (var i = this.buttons.length - 1; i >= 0; i--) {
			if (state == this.buttons[i].state)
				this.buttons[i].draw();
		};
}

/*TODOS
boid trails,
pause menu,
ranking results,
spatial hash,
code review
*/