function Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,state,text,lineWidth,font){
	this.x = x-width/2;
	this.y = y-height/2;
	this.width = width;
	this.height = height;
	this.boxStyle = boxStyle;
	this.text = text || "";
	this.strokeStyle = strokeStyle || "rgb(130,130,130)"
	this.fillStyle = fillStyle || "rgb(50,50,50)"
	this.state = state;
	this.lineWidth = lineWidth||1.3;
	this.font =font||"bold 19px Verdana";
	this.fontSize = parseInt(this.font.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'))
	console.log(this.fontSize)
}


Box.prototype.draw = function(){
	ctx.fillStyle = this.fillStyle;
	ctx.strokeStyle = this.strokeStyle;
	ctx.lineWidth = 3

	if (this.boxStyle == "roundRect"){
		roundRect(ctx,this.x,this.y,this.width,this.height,10)
		ctx.fill();
		ctx.stroke();
	}
	else{
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.strokeRect(this.x,this.y,this.width,this.height);

	}

	ctx.lineWidth = this.lineWidth
	ctx.font = this.font;
	ctx.strokeText(this.text,this.x+(this.width-ctx.measureText(this.text).width)/2,this.y+.5*this.height+.3*this.fontSize)
}



Button.prototype = new Box(0,0,0,0,"","","roundRect","")
function Button(x,y,width,height,text,state,callback,strokeStyle,fillStyle){
	this.x = x-width/2;
	this.y = y-height/2;
	this.width = width;
	this.height = height;
	this.callback = callback 
	this.text = text || "";
	this.strokeStyle = strokeStyle || "rgb(130,130,130)"
	this.fillStyle = fillStyle || "rgb(50,50,50)"
	this.state = state;
}

Button.prototype.isClicked = function(x,y){
	if (this.x<x&&this.y<y&&this.x+this.width>x&&this.y+this.height>y) {
		return true;
	};
}
