function Bullet(x,y,sX,sY){
	this.x = x;
	this.y = y;
	this.sX = sX;
	this.sY = sY;
	this.size = 2;
}

Bullet.prototype.move = function(){
	this.sX*=.999
	this.sY+=.003
	this.x += this.sX;
	this.y += this.sY;
}

Bullet.prototype.isColliding = function(){
	for (var i = GAME.blocks.length - 1; i >= 0; i--) {
		if (this.x + this.size  >= GAME.blocks[i].x && this.x <= GAME.blocks[i].x+GAME.blocks[i].width  &&
			this.y + this.size >= GAME.blocks[i].y && this.y <= GAME.blocks[i].y+GAME.blocks[i].height ){
			return true;
		}
	};
	for (var i = GAME.players.length - 1; i >= 0; i--) {
		if (this.x + this.size  >= GAME.players[i].x && this.x <= GAME.players[i].x+GAME.players[i].width  &&
			this.y + this.size >= GAME.players[i].y && this.y <= GAME.players[i].y+GAME.players[i].height ){
			return i;
		}
	};
	return false;
}	

Bullet.prototype.draw = function(){
	GAME.ctx.fillStyle = "red"
	GAME.ctx.fillRect(this.x,this.y,this.size,this.size);
}

Bullet.prototype.act = function(){
	this.move();
	this.draw();
	return this.isColliding();
	
}

