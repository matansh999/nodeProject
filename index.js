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
  res.render('index');
});

/*
app.get('/game/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  
  
  // Join the room.
  const socket = io.sockets.connected[socket.id];
  socket.join(roomId);
  
  // Redirect the user to the game page.
  //res.redirect('/game');
});
*/

io.on('connection', socket=>{
  console.log('User connected with ID:', socket.id);
  socket.on('joinRoom', function(roomName) {
    console.log(roomName)
    socket.join(roomName);
    socket.emit("roomJoined", roomName);
  });
  

  
  
  socket.emit("player",(player));
  if(player=="red"){
    player="yellow"
  }
  else{
    player="red"
  }

  

  socket.on("enter",(room)=>{
    if(player=="red"){
      player="yellow"
    }
    else{
      player="red"
    }
    console.log(player)
    console.log(room)
    io.to(room).emit("turn",player);
  })

  /*socket.on("endturn", function(socket){
    console.log("11111  ")
      //console.log(room)
    if(player=="red"){
      player="yellow"
    }
    else{
      player="red"
    }
    socket.to(room).emit("turn",player);
  });*/
});

server.listen(7777, function() {
  console.log('Server started on port 7777');
});
