window.onload = function()
{
	// Get the modal
	var modal = document.getElementById("myModal");
	
	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks on the button, open the modal
	btn.onclick = function() {
	  modal.style.display = "block";
	}
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
}


var socket = new WebSocket("ws://localhost:3000");

socket.onopen = function()
{
	//request stats feed
	socket.send(JSON.stringify({
		status: "stats"
	}));
}
socket.onmessage = function(event)
{
//	console.log(event.data);
//	var stats = JSON.parse(event.data);	
//
//	if(stats.status == "stats")
//	{
//		//var statslist = document.getElementById("stats").children;
////		for(var i = 1; i <= statslist.length; i++)
////		{
////			statslist[i-1].firstChild.innerHTML = stats[i];
////		}
//	}
//	else
//	{
//		console.log(event.data);
//	}
};

