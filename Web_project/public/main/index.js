function setup()
{
	size(window.innerWidth, window.innerHeight);
	background('#212121');
}

var x = 0;
var y = 0;
let test = new blob(window.innerWidth/2,145,36, "#404050");
function draw()
{
	background("#212121");
	//ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	//background('rgb(51,51,51)');
	if(mouseDown)
	{
		test.fall = true;
	//	stroke("rgba(255,0,255)")
	//	ctx.strokeRect(MouseX-25, MouseY-25, 50, 50);
	//	stroke("rgba(0,0,255)");
	//	ctx.strokeRect(MouseX-12.5, MouseY-12.5, 25,25);
	}
	test.show();
	test.update();

	//var img = new Image();
	//img.src = "image.png";
	//ctx.drawImage(img,window.innerWidth/2-325, window.innerHeight/2-250, 650, 500);	
}

function onResize()
{
	size(window.innerWidth, window.innerHeight);
	x = 0;
	y = 0;
}

function blob(x,y,size,color)
{
	this.color = color;
	this.fall = false;
	this.vx = 0;
	this.vy = 0;
	this.x = x;
	this.y = y;
	this.size = size;
}

blob.prototype.show = function()
{
	ctx.fillStyle = this.color;
	ctx.strokeStyle = "#777777";	
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	ctx.fill();	
	ctx.stroke();
	
	ctx.fillStyle = "rgb(51,51,51)";
}

blob.prototype.update = function()
{
	if(!this.fall)
	{
		this.vx = (MouseX - this.x)/20;
		//this.vy = (MouseY - this.y)/20;

		if(isNaN(this.vx))
		{
			this.vx = 0;
		}
		if(isNaN(this.vy))
		{
			this.vy = 0;
		}
	}
	else
	{
		this.vx = 0;
		this.vy = 10;
	}

	this.x += this.vx;
	this.y += this.vy;
}
















