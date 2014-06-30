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
				GAME.players[i].keys.jump[1]= true;
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
	this.jump = [j,false];
	this.shoot = [s, false]
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