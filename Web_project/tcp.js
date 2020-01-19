var express = require("express");
var http = require("http");;
var websocket = require("ws");
var url = require("url");

var app = express();
var port = 3000; 

var server = http.createServer(app).listen(port);

var waiting = [];
var playing = [];


app.use(express.static(__dirname + "/public/splashscreen"));
app.use(express.static(__dirname + "/public/main"));

const wss = new websocket.Server({server});

app.get("/", function(req, res)
{
	res.sendFile(__dirname + "/public/splashscreen/");
//	var q = url.parse(req.url, true).query;
//	name = q.name;
//	console.log(name);
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
			//temporary
			//very bad too.. should use the ids instead of ips.;
			//ws.send(JSON.stringify("play"));
			//add client to matchmaking queue			
			waiting.push(ws);
			//check if two people are connected
			if(waiting.length >= 2)
			{
				playing.push({
					red:{
						id: playing.length*2,
						ws: waiting.pop()
					},
					blue:
					{
						id: playing.length*2+1,
						ws: waiting.pop()
					}
				});	
				playing[playing.length-1].red.ws.send(JSON.stringify("play"));
				playing[playing.length-1].blue.ws.send(JSON.stringify("play"));
			}
			//expermiental print out all ips
			//question: should we do it by ip or FIFS?
			//for(var i = 0; i < clients.length; i++)
			//{
			//	console.log(clients[i]._socket.remoteAddress);
			//}
		}
		else if(JSON.parse(message).status == "message")
		{
			//send message to opponent;
			var opp;
			for(var i = 0; i < playing.length; i++)
			{
				if(playing[i].red.ws._socket.remoteAddress == ws._socket.remoteAddress || playing[i].blue.ws._socket.remoteAddress == ws._socket.remoteAddress)
				{
					opp = i;
					i = playing.length;
				}

				playing[opp].red.ws.send(JSON.stringify(JSON.parse(message).content));
				playing[opp].blue.ws.send(JSON.stringify(JSON.parse(message).content));
			}
		}
	});
});





