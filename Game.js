
var GAME;

window.onload = function(){
	GAME = new Game()

	var canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		GAME.ctx = canvas.getContext("2d");

	GAME.ctx.imageSmoothingEnabled = false;
    GAME.ctx.webkitImageSmoothingEnabled = false;
    GAME.ctx.mozImageSmoothingEnabled = false;
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


	
	GAME_loop();

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}

function GAME_loop(){
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

	for (var i = GAME.players.length - 1; i >= 0; i--) {
		GAME.players[i].act();
	};

	for (var i = GAME.blocks.length - 1; i >= 0; i--) {
		GAME.blocks[i].act();
	};

	requestAnimFrame(GAME_loop)
}




function Game(){
	this.ctx;
	this.state = "menu";
	this.keys = [new Keys(39,37,38,40), new Keys(68,65,87,83)];
	this.players = [new Player(this.keys[0],"green"),new Player(this.keys[1],"purple")];
	this.blocks = [new Block(0,canvas.height-50,canvas.width,20)];
	this.bullets = [];
	this.ui = new UI();	
	for (var i = 64; i >= 0; i--) {
			this.blocks.push(new Block(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*50+50,Math.random()*50+50));
		};	// Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,text,state)
}

Game.prototype.init = function(){
	this.state = "game";

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