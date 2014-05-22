
function Boid(x,y){
	this.x = x||Math.random() * canvas.width;
	this.y = y||Math.random() * canvas.height;
	this.angle =  Math.random()*2*Math.PI;
	this.speed = 1.4;
	this.rotation_speed = .025;
	this.color = -1;
	this.color_value = 0;
	this.size = 2;
}

Boid.prototype.rotate_towards = function(direction, coefficient){
	var difference = direction - this.angle;

	if (difference > Math.PI)
	  difference  -= Math.PI*2;
	else if (difference  < -Math.PI)
	  difference += Math.PI*2;

	if (direction-this.rotation_speed<this.angle&&this.angle<direction+this.rotation_speed)
		return direction;

	else if (difference < 0){
		this.angle-=this.rotation_speed*(coefficient||.9);
	}
	else if (difference > 0){
		this.angle+=this.rotation_speed*(coefficient||.9);
	} 

}

Boid.prototype.rotate_away = function(direction, coefficient){
	var difference = direction - this.angle;

	if (difference > Math.PI)
	  difference  -= Math.PI*2;
	else if (difference  < -Math.PI)
	  difference += Math.PI*2;

	if (difference > 0){
		this.angle-=this.rotation_speed;
	}
	else if (difference < 0){
		this.angle+=this.rotation_speed;
	}
}

Boid.prototype.move = function() {
	this.x+=this.speed*Math.cos(this.angle);
	this.y+=this.speed*Math.sin(this.angle);

	if (this.x<0)
		this.x = canvas.width;

	else if(this.x>canvas.width)
		this.x = 0;

	if (this.y<0)
		this.y = canvas.height;

	else if(this.y>canvas.height)
		this.y = 0;	
};


Boid.prototype.draw = function() {
	ctx.fillStyle = this.rgba_color();
	ctx.fillRect(this.x,this.y,this.size,this.size)
};

Boid.prototype.decrement_color = function(value){
	this.color_value-=value||.3;
	if (this.color_value<0){
		this.color_value = 0;
		this.color = -1;
	}

}

Boid.prototype.increment_color = function(boids){
	var max = 0, //color value of most colorful boid
		color = 0;	//color of most colorful boid
	for (var i = boids.length - 1; i >= 0; i--) {		//find which boid to get color from
		if(boids[i].color_value>max){
			max = boids[i].color_value
			color = boids[i].color
		}
	};
	
	
	if (this.color == -1) {
		this.color = color;
		this.color_value+=max/200
	}

	else if (this.color == color){
		this.color_value+=max/200
	}
	else
		this.decrement_color(max/25)

	if (this.color_value>255)
		this.color_value = 255;
}

Boid.prototype.increment_score = function(){
	for (var i = 0; i < GAME.players.length; i++) {
		if(GAME.players[i].color==this.color){
			GAME.players[i].score+=this.color_value/15000;
			if (GAME.players[i].score>=100) {
				GAME.players[i].win();
			};
		}
	};
}

Boid.prototype.rgba_color = function(r){
	var color = [0,0,0];
	if (this.color!=-1)		//if not black
		color[this.color] = this.color_value; //make color
	return "rgba("+Math.floor(color[0])+"," + Math.floor(color[1]) + "," + Math.floor(color[2])+ "," + (r||1) + ")";
}

Boid.prototype.act = function(boids){
		var near = near_boids(50, this, boids),
			too_near = near_boids(30,  this, near),
			average_location_flock = average_location(near);

		if (near.length>0){
			this.rotate_towards(average_direction(near))
			this.rotate_towards(direction_to(this, average_location_flock),.1);
			this.increment_color(near);
		}
		
		if(too_near.length>0) {
			this.rotate_away(average_direction(too_near))
		}

		this.decrement_color();
		this.increment_score();
		this.move();	
		this.draw();	
}
