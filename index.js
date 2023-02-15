const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var player ="red";

app.set('view engine', 'ejs');

// Define a route for the game page.
app.get('/game', (req, res) => {
  res.render('game.ejs');
});
app.get('/', (req, res) => {
  res.render('game');
});

io.on('connection', function(socket) {
  console.log('User connected with ID:', socket.id);
  socket.emit("player",player);
  if(player=="red"){
    player="yellow"
  }
  else{
    player="red"
  }
  socket.on("enter",()=>{
    if(player=="red"){
      player="yellow"
    }
    else{
      player="red"
    }
    socket.emit("turn",player);
  })

});

server.listen(7777, function() {
  console.log('Server started on port 7777');
});
