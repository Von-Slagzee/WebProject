var express = require("express");
var http = require("http");;
var websocket = require("ws");
var url = require("url");

var app = express();
var port = 3000; 

var server = http.createServer(app).listen(port);

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
	setTimeout(function()
	{
		ws.send(JSON.stringify("play"));

		//ws.close();	
	},000);


	update = function()
	{
		var x = [];
		x[0] = "stats";
		for(var i = 1; i < 4; i++)
		{
			x[i] = Math.floor(Math.random()*10)+1;
		}
		setTimeout(function()
		{
			ws.send(JSON.stringify(x));
	
			//ws.close();	
		},000);
		if(ws.readyState < 3)	
			setTimeout(update, 15000);
	}
	
	update();

	ws.on("message", function incoming(message)
	{
		ws.send(JSON.stringify("you said: " + message));
	});
});





