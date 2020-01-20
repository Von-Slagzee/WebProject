var MouseX;
var MouseY;
var mouseDown;
var turn;

document.getElementById("main").style.display = "none";

var socket = new WebSocket("ws://localhost:3000");


socket.onopen= function()
{
	//request matchmaking from server
	setTimeout(function()
	{
		socket.send(JSON.stringify({
			status: "play"
		}));
	}, 000);

}

socket.onmessage = function(event)
{
	console.log(event.data);
	
	var stats = JSON.parse(event.data);	

	if(stats.status == "play")
	{
		//console.log("playing");
		document.getElementById("main").style.display = "block";
		document.getElementById("waiting").style.display = "none";
		setTimer();						
	}
	else if(stats.status == "turn")
	{
		turn = stats.content;
	}
	else if(stats.status == "move")
	{
		matrix[stats.column].push("whatever");
		
		blobs[current_index].x = boardX + 100 * stats.column + 50;
		blobs[current_index].fall = true;
		current_index++;
		blobs.push(new blob(blobs[current_index-1].x,145,50, current_index%2==0 ? colors.blue:colors.red));

	}
	else
	{
	//	console.log(event.data);
	}
};

let sec = 0;
let min = 0;

function setTimer()
{
	setTimeout(setTimer, 1000);
	document.getElementById("timer").innerHTML = ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);

	sec++;
	if(sec >= 60)
	{
		sec-=60;
		min++;
	}
}


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

//sending a message to opponent
//for fun ig
function sendmsg(msg)
{
	socket.send(JSON.stringify(
	{
		status: "message",
		content: msg
	}));	
}

//Queue class
function queue()
{
	//this.head = ;
	//this.tail = ;
}

queue.prototype.enqueue = function()
{

}


//do these once the game runs
execSetup();
repeatDraw();

