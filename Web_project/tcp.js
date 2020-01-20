//TODO remove people who left matchmaking
//TODO what id someone leaves the whole match
//TODO find a method to keep track of users(if needed in the first place)
//TODO refreshes as new matches? Really now.
//TODO transmit opponents moves
//TODO block access to opponents disk
//TODO store in data structure that allows wins and losses
//TODO winning/losing page
//TODO move in ratios based on clients screen size
//TODO update game state on clients
//TODO prevent moves in bad positions
//TODO work around the limitation of using absolute positions
//TODO remove the timer thing that stops multiple clicks
//TODO idk, maybe make an in game chat box? A server without profanity cannot be called a server

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
		
		try
		{
			message = JSON.parse(message);
			if(message.status == "stats")
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
			else if(message.status == "play")
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
						blue: waiting.pop(),
						matrix: []
						
					});
				
					for(var i = 0; i < 7; i++)
					{
						playing[playing.length-1].matrix[i] = [];
					}

					playing[playing.length-1].red.ws.send(JSON.stringify(
					{
						status: "play"
					}));
				
					playing[playing.length-1].blue.ws.send(JSON.stringify(
					{
						status: "play"
					}));

					playing[playing.length-1].blue.ws.send(JSON.stringify(
					{
						status: "turn",
						content: true
					}));
				
					playing[playing.length-1].red.ws.send(JSON.stringify(
					{
						status: "turn",
						content: false
					}));
					

				}
			}
			else if(message.status == "message")
			{
				//send message to opponent;
				for(var i = 0; i < playing.length; i++)
				{
					if(playing[i].red.id == id)
					{
						playing[i].blue.ws.send(JSON.stringify(message.content));
						
						//BREAK
						i = playing.length;
					}
					else if(playing[i].blue.id == id)
					{
						playing[i].red.ws.send(JSON.stringify(message.content));
						//BREAK
						i = playing.length;
					}
				}
			}
			else if(message.status == "move")
			{
				var playing_index = 0;
				for(var i = 0; i < playing.length; i++)
				{
					if(playing[i].blue.id == id || playing[i].blue.id == id)
					{
						playing_index = i;
						console.log(playing_index);
						console.log(playing[playing_index]);
					}
				}
				
				ws.send(JSON.stringify(
				{
					status: "turn",
					content: false
				}));

				if(id % 2 == 0)
				{
					playing[playing_index].matrix[message.column].push("blue");	

					playing[playing_index].red.ws.send(JSON.stringify({
						status: "move",
						column: message.column
					}));
					playing[playing_index].red.ws.send(JSON.stringify({
						status: "turn",
						content: true
					}));

				}
				else
				{
					playing[playing_index].matrix[message.column].push("red");					
					playing[playing_index].blue.ws.send(JSON.stringify({
						status: "move",
						column: message.column
					}));
					playing[playing_index].blue.ws.send(JSON.stringify({
						status: "turn",
						content: true
					}));
				}
			}
		}
		catch(error)
		{
			console.log(error);			
		}

	});
});





