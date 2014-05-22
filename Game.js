
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
function gameUI(){
		ctx.fillStyle = "rgb(240,240,240)"
		ctx.fillRect(0,0,canvas.width,canvas.height);

		for (var i = GAME.buttons.length - 1; i >= 0; i--) {
			GAME.buttons[i].draw();
		};

		ctx.lineWidth = 1.3
		ctx.font = "bold 63px Verdana"
		ctx.strokeText("Influenza",(canvas.width-ctx.measureText("Influenza").width)/2+25,canvas.height*.45)
}


GAME_loop = function(){
	if(!GAME.initilized){
		gameUI();
	}

	else {
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
	this.initilized = false;
	this.keys = [new Keys(39,37),new Keys(68,65),new Keys(74,71)];
	this.players = [];
	this.boids = [];
	this.buttons = [new Button(canvas.width/2-120,canvas.height/2+50,100,50,"1-Player",(this.init.bind(this,1,50,2))),
					new Button(canvas.width/2,canvas.height/2+50,100,50,"2-Player",(this.init.bind(this,2,50,1))),
					new Button(canvas.width/2+120,canvas.height/2+50,100,50,"3-Player",(this.init.bind(this,3,50,0)))];

	
}

Game.prototype.init = function(number_of_players, number_of_boids,cpu){
	for (var i = number_of_players-1; i >= 0; i--) {
		this.players.push(new Player(i,this.keys[i]))
	};
	for (var i = cpu-1; i >= 0; i--) {
		this.players.push(new AIBoid(i+number_of_players,new Keys(-1,-1)))

	};

	for (var i = number_of_boids; i > 0; i--) {
		this.boids.push(new Boid());
	};

	this.initilized = true;
}

