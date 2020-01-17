var MouseX;
var MouseY;
var mouseDown;




window.addEventListener('resize', onResize);

window.addEventListener('mousedown', e => {
	mouseDown = true;
});

window.addEventListener('mouseup', e => {
  mouseDown = false;
});

window.addEventListener("mousemove", () => {
	 MouseX = event.clientX;
	 MouseY = event.clientY;
 }); 

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


function repeatDraw()
{
	requestAnimationFrame(repeatDraw);
	draw();
}

function execSetup()
{
	setup();
}

function size(width, height)
{
	canvas.width = width;
	canvas.height = height;	
}

function background(color)
{
	ctx.fillStyle = color;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

//these functions limit the total ability of the program 
//therefore, they are only used in certain cases
//ie, used only to prevent redundancy

function fill(color)
{
	//needs better implementation
	//ctx.strokeStyle = 'rgba(220,210,222,15)';
	ctx.fillStyle = color;

}

function stroke(color)
{
	ctx.strokeStyle = color;
}

function ellipse(x, y, width, height)
{
	ctx.beginPath();
	ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);	
}


function strokeWeight(weight)
{
	ctx.lineWidth = weight;
}

function rect(x, y, width, height)
{
	ctx.beginPath();
	ctx.rect(x, y, width, height);

	//ctx.fill();
}


function label(x, y, text)
{
	this.x = x;
	this.y = y;
	this.text = text;
}

label.prototype.show = function()
{
	fill("rgb(255,255,255)");
	//rect(this.x,this.y, 400,200);
	//ctx.fill();
	ctx.font = "30px Arial";
	fill("rgb(0,0,0)");
	fill('rgba(22,21,22,100)');
	ctx.fillText(this.text, this.x, this.y);
}


//do these once the game runs
execSetup();
repeatDraw();

