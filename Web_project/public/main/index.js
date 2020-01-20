let blobs = [];
let current_index;
let width;
let height;

const colors = {
	bg: "#444455",
	blue: "#606080",
	red: "#806060"
};


function setup()
{
	size(window.innerWidth, window.innerHeight);
	height =  window.innerHeight;
	width = window.innerWidth;
	current_index = 0;
	background(colors.bg);

	blobs.push(new blob(window.innerWidth/2,145,50, colors.blue));
}

function switchcolors()
{
	var turn = document.getElementById("turn");
//	var menus = document.getElementsByClassName("submenu");	

	var ref; 
	if(blobs[current_index].color == colors.red)
	{
		//turn blue
		ref = {
			bg: "#444455",
			turn: "Blue"
		}

	}
	else
	{
		//turn red
		ref = {
			bg: "#554444",
			turn: "Red"
		}

	}
	
	turn.innerHTML = ref.turn;
	colors.bg = ref.bg;

//	for(var i = 0; i < menus.length; i++)
//	{
//		menus[i].style.background = ref.bg;
//	}

}

var x = 0;
var y = 0;

function draw()
{
	background(colors.bg);
	
	if(mouseDown)
	{
	}
	
	for(var i = 0; i < blobs.length; i++)
	{
		blobs[i].show();
		blobs[i].update();
		if(i != current_index)
		{
			for(var j = 0; j < current_index; j++)
			{
				//check if collision happened
				if(i!=j && Math.abs(blobs[i].x - blobs[j].x) <= blobs[i].size + blobs[j].size-25)
				{
					if(Math.abs(blobs[i].y - blobs[j].y) <= blobs[i].size + blobs[j].size)
					{
						
						blobs[i].stop = true;
					}
				}
			}	
		}
					
	}

	var img = new Image();
	img.src = "image.png";
	ctx.drawImage(img,window.innerWidth/2-325, window.innerHeight/2-250, 700, 600);	
}

//temporary thing; to prevent annoying accidental clicks
var lastclicked = -1;
function mouseClicked()
{
	if(lastclicked != sec + 60*min)
	{
		switchcolors();
		blobs[current_index].fall = true;
		current_index++;
		blobs.push(new blob(blobs[current_index-1].x,145,50, current_index%2==0 ? colors.blue:colors.red));
	lastclicked = sec + 60*min;
		socket.send(JSON.stringify(
			{
				message: "details",
				blob: blobs[current_index],
				width: width,
				height: height
			}));
	}

	//current_index-1 ball will collide soon, with ground or other disks
	//check for that
}

function onResize()
{
	size(window.innerWidth, window.innerHeight);

	for(var i = 0; i < current_index; i++)
	{
		blobs[i].correctPos(width,height);
	}
		
	width = window.innerWidth;
	height = window.innerHeight;
}

function blob(x,y,size,color)
{
	this.color = color;
	this.fall = false;
	this.stop = false;	
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
	//ctx.stroke();
	
	ctx.fillStyle = "rgb(51,51,51)";
}

blob.prototype.update = function()
{
	if(!this.stop)
	{
		if(!this.fall)
		{
			this.vx = (MouseX - this.x)/20;
		//	this.vy = (MouseY - this.y)/20;
	
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
	
		if(this.y > window.innerHeight/2-250+600+(-this.size+15)*2+15)
		{
			this.vy = 0;
		}

		this.x += this.vx;
		this.y += this.vy;

	}
	else
	{
		
	}
}

blob.prototype.correctPos = function(width, height)
{
	//corrects position of a single blob based
	//on its position in the windoow relative to window size;
	//not ideal due to the way the board is place
	//but works for now
	//if teh board placement is fixed this part would work great
	//especially the y axis since it has a padding on top	
	this.x = this.x / width*window.innerWidth;
	this.y = this.y / height*window.innerHeight;
}











