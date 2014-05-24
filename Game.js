
var canvas,
	ctx,
	GAME;

window.onload = function(){
	canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


	GAME = new Game()
	GAME_loop();
	window.addEventListener("mousedown", onMousedown, false);
	window.addEventListener("mousemove", onMousemove, false);

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}

GAME_loop = function(){
	GAME.ui.drawUI(GAME.state);
	
	if (GAME.initilized) {
		ctx.fillStyle = "rgba(256,256,256,.2)"
		ctx.fillRect(0,0,canvas.width,canvas.height)
		ctx.fillStyle = "black"

		var actors = GAME.boids.concat(GAME.players);

		for (var i = actors.length-1; i >= 0; i--) {
			actors[i].act((actors.slice(0,i)).concat(actors.slice(i+1)))
		};
	}	
			requestAnimFrame(GAME_loop);

}




function Game(){
	this.MAX_SCORE = 1000;
	this.state = "menu";
	this.keys = [new Keys(39,37),new Keys(68,65),new Keys(74,71)];
	this.players = [];
	this.boids = [];
	this.ui = new UI([new Button(canvas.width/2-120,canvas.height/2,100,50,"1-Player","menu",(this.init.bind(this,1,50,5))),
					new Button(canvas.width/2,canvas.height/2,100,50,"2-Player","menu",(this.init.bind(this,2,50,4))),
					new Button(canvas.width/2+120,canvas.height/2,100,50,"3-Player","menu",(this.init.bind(this,3,50,3)))],
					[new Box(canvas.width/2,canvas.height/2-60,0,0,"rgb(50,50,50)","rgb(50,50,50)","sharpCorners","menu","Influenza",1.3,"bold 63px Verdana"),
					new Box(canvas.width/2,canvas.height/2,canvas.width,canvas.height,"rgb(240,240,240)","rgb(240,240,240)","sharpCorners","menu")]);		// Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,text,state)
	}

Game.prototype.init = function(number_of_players, number_of_boids,cpu){
	this.state = "game";
	var colors = [[0,0,1],[0,1,0],[1,0,0],[1,0,1],[1,1,0],[0,1,1]];
	for (var i = number_of_players-1; i >= 0; i--) {
		this.players.push(new Player(colors[i],this.keys[i]))
	};
	for (var i = cpu-1; i >= 0; i--) {
		this.players.push(new AIBoid(colors[i+number_of_players],new Keys(-1,-1)))

	};

	for (var i = number_of_boids; i > 0; i--) {
		this.boids.push(new Boid());
	};

	this.initilized = true;
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
win menu,
score,
boid trails,
pause menu,
ranking results,
spatial hash,
code review
*/