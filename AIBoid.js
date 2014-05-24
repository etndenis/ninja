
AIBoid.prototype = new Boid(100,100);


function AIBoid(color,keys){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.color = color;
	this.keys = keys;
	this.angle =  Math.random()*2*Math.PI;
	this.color_value = 1650
	this.speed = 1.45;
	this.size = 4;
	this.score = 0;
	this.win = Player.prototype.win;
}

AIBoid.prototype.act = function(boids){
	var near = near_boids(50, this, boids),
			too_near = near_boids(40,  this, near),
			average_location_flock = average_location(near);

	if (near.length>0){
		this.rotate_towards(average_direction(near))
	}
	
	if(too_near.length>0) {
		this.rotate_away(average_direction(too_near))
	}

	this.move();
	this.draw();
	Player.prototype.draw_score.call(this);
}
