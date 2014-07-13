function Flag(x,y){
	this.x = x;
	this.y = y-20;
	this.size = 2;
}

Flag.prototype.draw = function(){

	GAME.ctx.fillRect(this.x, this.y,2,20);
	GAME.ctx.fillStyle = "red"
	for (var y = 4; y >= 0; y--) {
		for (var x = 3; x >= 0; x--) {
			GAME.ctx.fillRect(this.x+this.size+this.size*2*x+(y%2)*this.size,this.y+this.size*y,this.size,this.size);
		};
	};
}

Flag.prototype.isColliding = function(){
	for (var i = GAME.players.length - 1; i >= 0; i--) {
		if(this.x + this.size >= GAME.players[i].x && this.x <= GAME.players[i].x+GAME.players[i].width  &&
			this.y + 20  >= GAME.players[i].y && this.y <= GAME.players[i].y+GAME.players[i].height){
			GAME.state = "win"
			GAME.ui.boxes[2].color = GAME.players[i].color;
		}
	};
}

Flag.prototype.act = function(){
	this.isColliding();
	this.draw();
}