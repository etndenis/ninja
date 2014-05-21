
var canvas,
	ctx,
	game;

window.onload = function(){
	canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


	game = new Game()
	gameUI();

	window.addEventListener("mousedown", onMousedown, false);
	window.addEventListener("mousemove", onMousemove, false);

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}
function gameUI(){
	if(!game.intilized){
		ctx.fillStyle = "rgb(240,240,240)"
		ctx.fillRect(0,0,canvas.width,canvas.height);

		for (var i = game.buttons.length - 1; i >= 0; i--) {
			game.buttons[i].draw();
		};

		ctx.lineWidth = 1.3
		ctx.font = "bold 63px Verdana"
		ctx.strokeText("Influenza",(canvas.width-ctx.measureText("Influenza").width)/2+25,canvas.height*.45)
	}
}


game_loop = function(){
	ctx.fillStyle = "rgba(256,256,256,.2)"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"

	for (var i = game.boids.length-1; i >= 0; i--) {
		game.boids[i].act((game.boids.slice(0,i)).concat(game.players,game.boids.slice(i+1)))
	};

	for (var i = game.players.length - 1; i >= 0; i--) {
		game.players[i].act();
	}	

	requestAnimFrame(game_loop);
}

function onMousemove(e){
	var pos = getMousePos(canvas, e);

	for (var i = game.buttons.length - 1; i >= 0; i--) {
		if (game.buttons[i].isClicked(pos.x,pos.y)) {
			game.buttons[i].fillStyle = "rgb(80,80,80)";
		}
		else
			game.buttons[i].fillStyle = "rgb(50,50,50)";
	};

	gameUI();
}

function onMousedown(e){
	var pos = getMousePos(canvas, e);

	for (var i = 0; i < game.buttons.length; i++) {
		if (game.buttons[i].isClicked(pos.x,pos.y)) {
			game.buttons[i].callback();
			game.buttons = [];
		};
	};
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function Button(x,y,width,height,text,callback,strokeStyle,fillStyle){
	this.x = x-height/2;
	this.y = y-width/2;
	this.width = width;
	this.height = height;
	this.callback = callback
	this.text = text;
	this.strokeStyle = strokeStyle || "rgb(130,130,130)"
	this.fillStyle = fillStyle || "rgb(50,50,50)"
}

Button.prototype.isClicked = function(x,y){
	if (this.x<x&&this.y<y&&this.x+this.width>x&&this.y+this.height>y) {
		return true;
	};
}

Button.prototype.draw = function(){
	ctx.fillStyle = this.fillStyle;
	ctx.strokeStyle = this.strokeStyle;
	ctx.lineWidth = 3


	roundRect(ctx,this.x,this.y,this.width,this.height,10)
	ctx.fill();
	ctx.stroke();

	ctx.lineWidth = 1.3
	ctx.font = "bold 19px Verdana"
	ctx.strokeText(this.text,this.x+this.width*.041,this.y+this.height/2+7.5)

}

function Game(){
	this.intilized = false;
	this.keys = [new Keys(39,37),new Keys(68,65),new Keys(74,71)];
	this.players = [];
	this.boids = [];
	this.buttons = [new Button(canvas.width/2-120,canvas.height/2+50,100,50,"1-Player",(this.init.bind(this,1,30))),
					new Button(canvas.width/2,canvas.height/2+50,100,50,"2-Player",(this.init.bind(this,2,40))),
					new Button(canvas.width/2+120,canvas.height/2+50,100,50,"3-Player",(this.init.bind(this,3,50)))];

	
}

Game.prototype.init = function(number_of_players, number_of_boids){
	for (var i = number_of_players-1; i >= 0; i--) {
		this.players.push(new Player(i,this.keys[i]))
	};

	for (var i = number_of_boids; i > 0; i--) {
		this.boids.push(new Boid());
	};

	this.intilized = true;

	game_loop();

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
		this.decrement_color(max/25)

	if (this.color_value>255)
		this.color_value = 255;
}

Boid.prototype.increment_score = function(){
	for (var i = game.players.length - 1; i >= 0; i--) {
		if(game.players[i].color==this.color)
			game.players[i].score+=this.color_value/15000;
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


function Player(color,keys){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.keys = keys;
	this.color = color;
	this.angle =  Math.random()*2*Math.PI;
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
	for (var i = game.players.length - 1; i >= 0; i--) {
		switch (k) {
		
			case (game.players[i].keys.left[0]): // Left
					game.players[i].keys.left[1]=true;
				break;
			
			case (game.players[i].keys.right[0]): // Right
					game.players[i].keys.right[1]=true;
				break;
		};
	};	
}

function onKeyup(e) {
	var k  = e.keyCode;
	for (var i = game.players.length - 1; i >= 0; i--) {
		switch (k) {

			case game.players[i].keys.left[0]: // Left
				game.players[i].keys.left[1]= false;
				break;

			case game.players[i].keys.right[0]: // Right
				game.players[i].keys.right[1]= false;
				break;
		};
	}

};


function Keys(r,l){
	this.right = [r,false];
	this.left = [l,false];
}

function roundRect (ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
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