function Block(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Block.prototype.draw = function(){
	GAME.ctx.fillStyle = "black"
	GAME.ctx.fillRect(this.x,this.y,this.width,this.height)
}

Block.prototype.act = function(){

	this.draw();
}