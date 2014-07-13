function Player(keys,color){
	this.x = 50+100*Math.random();
	this.y = 50;
	this.width = 13;
	this.height = 13;
	this.colliding = [false,false,false,false];
	this.sX = 0;
	this.sY = 0;
	this.keys = keys;
	this.direction = 5;
	this.color = color;
}

Player.prototype.control = function(){
	if (this.keys.right[1] && this.sX<=25) {
		this.sX+=.3
		this.direction = 5
	};
	if (this.keys.left[1] && this.sX>=-25) {
		this.sX-=.3
		this.direction = -5
	};
	if(this.keys.jump[1]&&(this.colliding[1])){
			this.sY=-5;
	}
	if (this.keys.shoot[1]) {
		GAME.bullets.push(new Bullet(this.x,this.y,this.direction,0))
	}
	else if (this.keys.jump[1]&&((this.colliding[2])||(this.colliding[4]))) {
		this.sY=-4.5;
		if (this.colliding[2])
			this.sX += 5;
		else
			this.sX-= 5;
	};
}	

Player.prototype.move = function(){	
	
	
	if((this.colliding[2] )||(this.colliding[4])){
		this.sY+=.05
	}
	
		
	if((!this.colliding[1]&&!this.colliding[2]&&!this.colliding[3]&&!this.colliding[4])) {
		this.sY += .2;
		this.sX*=.90;
		this.keys.jump[1]=false;
	};

	if(this.colliding[1]){
		this.sY = 0
		
		this.sX*=.890;

	}
	this.x += this.sX;
	this.y += this.sY;
}

Player.prototype.isColliding = function(){
	var oldCollisions = this.colliding;
	this.colliding = [false,false,false,false,false]
	for (var i = GAME.blocks.length - 1; i >= 0; i--) {
		if (this.x+this.sX + this.width  >= GAME.blocks[i].x&&this.x+this.sX <= GAME.blocks[i].x+GAME.blocks[i].width&&
			this.y+this.sY + this.height >= GAME.blocks[i].y&&this.y+this.sY <= GAME.blocks[i].y+GAME.blocks[i].height) {
			if (this.y+this.height<=GAME.blocks[i].y) { //upper half of square
				if (this.x<GAME.blocks[i].x) { //top left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope<verticeSlope) {
						this.colliding[4] = true;//left side
					}
					else {
						this.colliding[1] = true;//top side
					}
				}

				else if (this.x>GAME.blocks[i].x+GAME.blocks[i].width) { //top left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope>verticeSlope) {
						this.colliding[2] = true;//right side
					}
					else {
						this.colliding[1] = true; //top side
					}
				}

				else { //top side
					this.y = GAME.blocks[i].y-this.height;
					this.colliding[1] = true;
				}
			}
			else if (this.y>=GAME.blocks[i].y+GAME.blocks[i].height) {

				if (this.x<GAME.blocks[i].x) { //bottom left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope<verticeSlope) {
						this.colliding[4] = true;//left side
					}
					else {
						this.colliding[3] = true;//bottom side
					}
				}

				else if (this.x>GAME.blocks[i].x+GAME.blocks[i].width) { //bottom right
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope>verticeSlope) {
						this.colliding[2] = true;//right side
					}
					else {
						this.colliding[3] = true; //bottom side
					}
				}

				else { //bottom side
					this.colliding[3] = true 
					this.sY *=-1;
					this.y = GAME.blocks[i].y + GAME.blocks[i].height

					//this.colliding = true;
				}
			}
			else{
				this.sX *=0
				if(!oldCollisions[2]&&!oldCollisions[4]){
					this.sY *=.2
				}
				if (this.x<=GAME.blocks[i].x) { // left
					this.colliding[4] = true
					this.x=GAME.blocks[i].x-this.width
				}

				else if (this.x>=GAME.blocks[i].x+GAME.blocks[i].width) { // right
					this.colliding[2] = true

					this.x=GAME.blocks[i].x+GAME.blocks[i].width

				}
			}
		}
		
	}
}

Player.prototype.draw = function(){
	//GAME.ctx.fillStyle = this.color;
	//GAME.ctx.fillRect(this.x,this.y,this.width,this.height);
	GAME.ctx.drawImage(GAME.images,0,0,13,13,this.x,this.y,this.width,this.height)
}

Player.prototype.act = function(){
	this.control();
	this.isColliding();

	this.move();
	this.draw();
}

/*if(GAME.blocks[i].x<this.x+this.width&&GAME.blocks[i].x+GAME.blocks[i].width>this.x){
			if (GAME.blocks[i].y<=this.y+this.height&&GAME.blocks[i].y+GAME.blocks[i].height/2>=this.y) {
				if (!this.colliding) {
					this.y = GAME.blocks[i].y-this.height;
				};
				this.sY = 0
				this.colliding = true;
			}
			if (GAME.blocks[i].y + GAME.blocks[i].height>=this.y&&GAME.blocks[i].y+GAME.blocks[i].height/2<=this.y) {
				this.sY*=-1
			}
		}
		else if (GAME.blocks[i].y<this.y+this.height&&GAME.blocks[i].y+GAME.blocks[i].height>this.y) {
			if (GAME.blocks[i].x + GAME.blocks[i].width>=this.x&&GAME.blocks[i].x+GAME.blocks[i].width/2<=this.x) {
				this.x = GAME.blocks[i].x+GAME.blocks[i].width;
				this.sX*=-1
			}
			if (GAME.blocks[i].x <=this.x+this.width&&GAME.blocks[i].x+GAME.blocks[i].width/2>=this.x) {
				this.x = GAME.blocks[i].x-this.width;
				this.sX*=-1
			}
		};
		*/