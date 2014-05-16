
var canvas,
	ctx,
	boids,
	players;

function init(){
	canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		ctx = canvas.getContext("2d");

	boids = [];
	for (var i = 50; i >= 0; i--) {
		boids.push(new Boid());
	};
	players = [];
	players.push(new Player(39,37));
	act();
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}

function act(){
	ctx.fillStyle = "rgba(256,256,256,.1)"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"

	var copy = boids.concat(players);

	for (var i = boids.length-1; i >= 0; i--) {

		var near = near_boids(50, copy[i], copy),
			too_near = near_boids(30,  copy[i], near),
			average_location_flock = average_location(near);


		if (near.length!=1){
			boids[i].rotate_towards(average_direction(near))
			if (distance(new Boid(average_location_flock[0],average_location_flock[1]),boids[i])>30)
				boids[i].rotate_towards(direction_to(boids[i], average_location_flock));

		}
		
		if(too_near.length!=1) 
			boids[i].rotate_away(average_direction(too_near))
		//boids[i].average_color(near)
		boids[i].move();
		
		if (boids[i].x<0)
			boids[i].x = canvas.width;

		else if(boids[i].x>canvas.width)
			boids[i].x = 0;

		if (boids[i].y<0)
			boids[i].y = canvas.height;

		else if(boids[i].y>canvas.height)
			boids[i].y = 0;
		

		boids[i].draw();	
	};
	players[0].control();
	players[0].move();

	if (players[0].x<0)
			players[0].x = canvas.width;

	else if(boids[0].x>canvas.width)
		players[0].x = 0;

	if (players[0].y<0)
		players[0].y = canvas.height;

	else if(players[0].y>canvas.height)
		players[0].y = 0;
		
	players[0].draw();

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
	this.speed = 1;
	this.rotation_speed = .025;
	this.color = [0,0,0] 
}

Boid.prototype.rotate_towards = function(direction){
	var difference = direction - this.angle;

	if (difference > Math.PI)
	  difference  -= Math.PI*2;
	else if (difference  < -Math.PI)
	  difference += Math.PI*2;

	if (direction-this.rotation_speed<this.angle&&this.angle<direction+this.rotation_speed)
		return direction;

	else if (difference < 0){
		this.angle-=this.rotation_speed*.9;
	}
	else if (difference > 0){
		this.angle+=this.rotation_speed*.9;
	}

}

Boid.prototype.rotate_away = function(direction){
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
};


Boid.prototype.draw = function() {
	ctx.fillStyle = "rgb("+this.color[0]+"," + this.color[1] + "," + this.color[2]+ ")";
	ctx.fillRect(this.x,this.y,2,2)
};

Player.prototype = new Boid(100,100);


function Player(r,l){
	this.keys = new Keys(r,l);
	this.color = [256,0,0]
}



Player.prototype.control = function(){
	if (this.keys.right[1])
		this.angle+=this.rotation_speed*2;
	if (this.keys.left[1])
		this.angle-=this.rotation_speed*2;
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
	console.log(boids.length)
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