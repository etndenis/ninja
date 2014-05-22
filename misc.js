
function onMousedown(e){
	var pos = getMousePos(canvas, e);
	if (!GAME.initilized) {
		console.log(e)
		for (var i = 0; i < GAME.buttons.length; i++) {
			if (GAME.buttons[i].isClicked(pos.x,pos.y)) {
				GAME.buttons[i].callback();
			};
		};
	}	
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function onMousemove(e){
	var pos = getMousePos(canvas, e);
	//console.log(GAME.boids.length)
	if (!GAME.initilized) {
		for (var i = GAME.buttons.length - 1; i >= 0; i--) {
			if (GAME.buttons[i].isClicked(pos.x,pos.y)) {
				GAME.buttons[i].fillStyle = "rgb(80,80,80)";
			}
			else
				GAME.buttons[i].fillStyle = "rgb(50,50,50)";
		};
	}

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



function onKeydown(e){
	var k = e.keyCode;
	for (var i = GAME.players.length - 1; i >= 0; i--) {
		switch (k) {
		
			case (GAME.players[i].keys.left[0]): // Left
					GAME.players[i].keys.left[1]=true;
				break;
			
			case (GAME.players[i].keys.right[0]): // Right
					GAME.players[i].keys.right[1]=true;
				break;
		};
	};	
}

function onKeyup(e) {
	var k  = e.keyCode;
	for (var i = GAME.players.length - 1; i >= 0; i--) {
		switch (k) {

			case GAME.players[i].keys.left[0]: // Left
				GAME.players[i].keys.left[1]= false;
				break;

			case GAME.players[i].keys.right[0]: // Right
				GAME.players[i].keys.right[1]= false;
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

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

/*
multi canvas
*/