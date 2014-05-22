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
