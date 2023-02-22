const express = require('express');
const http = require('http');
const { disconnect } = require('process');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var player ="yellow";
var playersID=[];
app.set('view engine', 'ejs');

// Define a route for the game page.
app.get('/', (req, res) => {
  res.render('game.ejs');
});
//app.get('/', (req, res) => {
//  res.render('index');
//});

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

io.sockets.on('connection', (socket)=>{
  if(playersID.length<2){
    playersID.push(socket.id)
  }
  socket.on("disconnect", function(socket){
    playersID.splice(playersID.indexOf(socket.id),1)
    console.log('User connected with ID:',playersID );
  })
  console.log('User connected with ID:',playersID );
  /*socket.on('joinRoom', function(roomName) {
    console.log(roomName)
    try{
      console.log("joining room")
      socket.join(roomName,()=>{
        console.log(socket.id + " now in room " + socket.rooms + "\n")
      })
    }
    catch(error){
      console.error(error)
    }
    socket.emit("roomJoined", roomName);
    
  });
*/  
  socket.emit("player",(player));
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
    console.log(player)
    //io.emit("turn",player);
    io.to(playersID[1]).emit("turn",player);
    io.to(playersID[0]).emit("turn",player);
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
