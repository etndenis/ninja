function onMousedown(e){
	var pos = getMousePos(canvas, e);
		for (var i = 0; i < GAME.ui.buttons.length; i++) {

			if (GAME.ui.buttons[i].isClicked(pos.x,pos.y)&&GAME.state == GAME.ui.buttons[i].state) {
				GAME.ui.buttons[i].callback();
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

function onMousemove(e){
	var pos = getMousePos(canvas, e);
	//console.log(GAME.boids.length)
		for (var i = GAME.ui.buttons.length - 1; i >= 0; i--) {
			if (GAME.ui.buttons[i].isClicked(pos.x,pos.y)) {
				GAME.ui.buttons[i].fillStyle = "rgb(80,80,80)";
			}
			else
				GAME.ui.buttons[i].fillStyle = "rgb(50,50,50)";
		};
	

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

			case GAME.players[i].keys.jump[0]: // Right
				if(GAME.players[i].keys.jump[2]){
					GAME.players[i].keys.jump[1]= true;
				}
				GAME.players[i].keys.jump[2]= false;
				break;		

			case GAME.players[i].keys.shoot[0]: // Right
				GAME.players[i].keys.shoot[1]= true;
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

			case GAME.players[i].keys.jump[0]: // Right
				GAME.players[i].keys.jump[1]= false;
				GAME.players[i].keys.jump[2]= true;

				break;

			case GAME.players[i].keys.shoot[0]: // Right
				GAME.players[i].keys.shoot[1]= false;
				break;
		};
	}

};

function Keys(r,l,j,s){
	this.right = [r,false];
	this.left = [l,false];
	this.jump = [j,false,true];
	this.shoot = [s, false]
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
multi canvas
*/