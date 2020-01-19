var express = require("express");
var http = require("http");;
var websocket = require("ws");
var url = require("url");

var app = express();
var port = 3000; 

var server = http.createServer(app).listen(port);

var waiting = [];
var playing = [];
var ids = 0;

app.use(express.static(__dirname + "/public/splashscreen"));
app.use(express.static(__dirname + "/public/main"));

const wss = new websocket.Server({server});

app.get("/", function(req, res)
{
	res.sendFile(__dirname + "/public/splashscreen/");
});

app.get("/play", function(req, res)
{
	res.sendFile(__dirname + "/public/main/main.html");
});

app.get("/*", function(req, res)
{
	res.send("404, lost your way kiddo?")
});


wss.on("connection", function(ws, require)
{
	var id = ids;
	ids++;
	ws.on("message", function incoming(message)
	{
		//temporary message status
		if(message == "stats")
		{
			update = function()
			{
				var x = [];
				x[0] = "stats";
				for(var i = 1; i < 4; i++)
				{
					x[i] = Math.floor(Math.random()*10)+1;
				}

				ws.send(JSON.stringify(x));
				if(ws.readyState < 3)	
					setTimeout(update, 15000);
			}

			update();	

		}
		else if(message == "play")
		{
			//allow client to enter session
			waiting.push({
				id: id,
				ws: ws
			});
			//check if two people are connected
			if(waiting.length >= 2)
			{
				playing.push({
					red: waiting.pop(),
					blue: waiting.pop()
					
				});	
				playing[playing.length-1].red.ws.send(JSON.stringify("play"));
				playing[playing.length-1].blue.ws.send(JSON.stringify("play"));
			}
		}
		else if(JSON.parse(message).status == "message")
		{
			//send message to opponent;
			for(var i = 0; i < playing.length; i++)
			{
				if(playing[i].red.id == id)
				{
					playing[i].blue.ws.send(JSON.stringify(JSON.parse(message).content));
					
					//BREAK
					i = playing.length;
				}
				else if(playing[i].blue.id == id)
				{
					playing[i].red.ws.send(JSON.stringify(JSON.parse(message).content));
					//BREAK
					i = playing.length;
				}
			}
		}
	});
});





