function Player(keys,color){
	this.x = 50+100*Math.random();
	this.y = 50;
	this.width = 4;
	this.height = 10;
	this.colliding = false;
	this.sX = 0;
	this.sY = 0;
	this.keys = keys;
	this.direction = 5;
	this.color = color;
}

Player.prototype.control = function(){
	if (this.keys.right[1] && this.sX<=7) {
		this.sX+=.3
		this.direction = 5
	};
	if (this.keys.left[1] && this.sX>=-7) {
		this.sX-=.3
		this.direction = -5
	};
	if(this.keys.jump[1]&&(this.colliding==1)){
			this.sY=-5;
	}
	if (this.keys.shoot[1]) {
		GAME.bullets.push(new Bullet(this.x,this.y,this.direction,0))
	}
	else if (this.keys.jump[1]&&(this.colliding==2||this.colliding==4)) {
		this.sY=-5;
		if (this.colliding==2)
			this.sX += 5;
		else
			this.sX-= 5;
	};
}	

Player.prototype.move = function(){	
	if(this.colliding==1){
		this.sY = 0
		
		this.sX*=.850;

	}
	else if(this.colliding == 2 || this.colliding == 4){
		this.sY+=.05
		this.sX*=.9
	}
	else {
		this.sY += .2;
		this.sX*=.90;
	}
		
	this.x += this.sX;
	this.y += this.sY;
}

Player.prototype.isColliding = function(){
	this.colliding = 0
	for (var i = GAME.blocks.length - 1; i >= 0; i--) {
		if (this.x+this.sX +this.width>= GAME.blocks[i].x&&this.x+this.sX <= GAME.blocks[i].x+GAME.blocks[i].width&&
			this.y+this.sY + this.height >= GAME.blocks[i].y&&this.y+this.sY <= GAME.blocks[i].y+GAME.blocks[i].height) {

			if (this.y+this.height<=GAME.blocks[i].y) { //upper half of square
				if (this.x<GAME.blocks[i].x) { //top left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope<verticeSlope) {
						this.colliding = 4;//left side
					}
					else {
						this.colliding = 1;//top side
					}
				}

				else if (this.x>GAME.blocks[i].x+GAME.blocks[i].width) { //top left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope>verticeSlope) {
						this.colliding = 2;//right side
					}
					else {
						this.colliding = 1; //top side
					}
				}

				else { //top side
					this.y = GAME.blocks[i].y-this.height;
					this.colliding = 1;
				}
			}
			else if (this.y>=GAME.blocks[i].y+GAME.blocks[i].height) {

				if (this.x<GAME.blocks[i].x) { //bottom left
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope<verticeSlope) {
						this.colliding = 4;//left side
					}
					else {
						this.colliding = 3;//bottom side
					}
				}

				else if (this.x>GAME.blocks[i].x+GAME.blocks[i].width) { //bottom right
					var verticeSlope = (this.y - GAME.blocks[i].y)/(this.x - GAME.blocks[i].x), 
						actualSlope = this.sY/this.sX;

					if (actualSlope>verticeSlope) {
						this.colliding = 2;//right side
					}
					else {
						this.colliding = 3; //bottom side
					}
				}

				else { //bottom side
					this.colliding = 3
					this.sY *=-1;
					this.y = GAME.blocks[i].y + GAME.blocks[i].height

					//this.colliding = true;
				}
			}
			else{
				this.sX *=0

				if (this.x<=GAME.blocks[i].x) { // left
					this.colliding = 4
					this.x=GAME.blocks[i].x-this.width
				}

				else if (this.x>=GAME.blocks[i].x+GAME.blocks[i].width) { // right
					this.colliding = 2
					this.x=GAME.blocks[i].x+GAME.blocks[i].width

				}
			}
		};	
	}
}

Player.prototype.draw = function(){
	GAME.ctx.fillStyle = this.color;
	GAME.ctx.fillRect(this.x,this.y,this.width,this.height);
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