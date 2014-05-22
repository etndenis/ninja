Player.prototype = new Boid(100,100)


function Player(color,keys){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.keys = keys;
	this.color = color;
	this.angle =  Math.random()*2*Math.PI;
	this.color_value = 256
	this.speed = 1.45;
	this.size = 4;
	this.score = 0;
}



Player.prototype.control = function(){
	if (this.keys.right[1])
		this.angle+=this.rotation_speed*2;
	if (this.keys.left[1])
		this.angle-=this.rotation_speed*2;
}

Player.prototype.draw_score = function(){
	ctx.fillStyle = this.rgba_color(.1);
	ctx.fillRect(0,0,this.score,15);
}

Player.prototype.act = function(){
	this.control();
	this.move();
	this.draw();
	this.draw_score();
}

Player.prototype.win = function(){
	GAME.players =  [];
	GAME.boids = [];
	GAME.initilized = false;
}