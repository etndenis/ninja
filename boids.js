
var canvas,
	ctx,
	boids,
	players;

window.onload = function(){
	canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	boids = [];
	players = [];

	for (var i = 30; i >= 0; i--) {
		boids.push(new Boid());
	};

	players.push(new Player(2,74,71));
	players.push(new Player(1,39,37));
	players.push(new Player(0,68,65));

	act();

	ctx.fillStyle = "black"
	ctx.fillRect(0,0,canvas.width,canvas.height)

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}

function act(){
	ctx.fillStyle = "rgba(256,256,256,.1)"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"

	for (var i = boids.length-1; i >= 0; i--) {
		boids[i].act((boids.slice(0,i)).concat(players,boids.slice(i+1)))
	};

	for (var i = players.length - 1; i >= 0; i--) {
		players[i].act();
	}	

	requestAnimFrame(act);
}

function direction_to(boid, target){
	return Math.atan2(target[1]-boid.y,target[0]-boid.x);
}

function average_direction(boids){
	var total = 0;
	for (var i = boids.length - 1; i >= 0; i--) {
		total += boids[i].angle;
	};
	return total/boids.length;
}

function near_boids(dis, boid, boids){
	var near = [];
	for (var i = boids.length - 1; i >= 0; i--) {
		if(distance(boid, boids[i])<dis)
			near.push(boids[i]);

	};
	return near;
}

function average_location(boids){
	var totalX = 0,
		totalY = 0;

	for (var i = boids.length - 1; i >= 0; i--){
		totalX += boids[i].x;
		totalY += boids[i].y;
	}
	
	return [totalX/boids.length, totalY/boids.length];
}



function distance(boid1, boid2) {
	return Math.sqrt(Math.pow(boid1.x-boid2.x,2)+Math.pow(boid1.y-boid2.y,2))
}

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
		this.decrement_color(max/75)

	if (this.color_value>255)
		this.color_value = 255;
}

Boid.prototype.increment_score = function(){
	for (var i = players.length - 1; i >= 0; i--) {
		if(players[i].color==this.color)
			players[i].score+=this.color_value/10000;
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

Player.prototype = new Boid(100,100);


function Player(color,r,l){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.keys = new Keys(r,l);
	this.color = color;
	this.color_value = 256
	this.speed = 1.6;
	this.size = 4;
	this.score = 0;
}



Player.prototype.control = function(){
	if (this.keys.right[1])
		this.angle+=this.rotation_speed*2;
	if (this.keys.left[1])
		this.angle-=this.rotation_speed*2;
}

Player.prototype.control = function(){
	if (this.keys.right[1]){
		this.angle+=this.rotation_speed*2;
	}
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
function onKeydown(e){
	var k = e.keyCode;
	for (var i = players.length - 1; i >= 0; i--) {
		switch (k) {
		
			case (players[i].keys.left[0]): // Left
					players[i].keys.left[1]=true;
				break;
			
			case (players[i].keys.right[0]): // Right
					players[i].keys.right[1]=true;
				break;
		};
	};	
}

function onKeyup(e) {
	var k  = e.keyCode;
	for (var i = players.length - 1; i >= 0; i--) {
		switch (k) {

			case players[i].keys.left[0]: // Left
				players[i].keys.left[1]= false;
				break;

			case players[i].keys.right[0]: // Right
				players[i].keys.right[1]= false;
				break;
		};
	}

};


function Keys(r,l){
	this.right = [r,false];
	this.left = [l,false];
}


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/*
object oriented(inheritance) 
multi canvas
*/