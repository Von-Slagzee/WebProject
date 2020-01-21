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
	var stats = JSON.parse(event.data);	

	if(stats.status == "play")
	{
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
		switchcolors();	
		blobs[current_index].x = boardX + 100 * stats.column + 50;
		blobs[current_index].column = stats.column;
		blobs[current_index].row = matrix[stats.column].length-1;
		blobs[current_index].fall = true;
		current_index++;
		blobs.push(new blob(blobs[current_index-1].x,145,50, current_index%2==0 ? colors.blue:colors.red));
	}
	else if(stats.status == "mouseX")
	{
		MouseX = stats.content;
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
	if(turn)
	{
	 	MouseX = event.clientX;
	 	MouseY = event.clientY;
	}
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



//do these once the game runs
execSetup();
repeatDraw();

