const express = require('express');
const http = require('http');
const { disconnect } = require('process');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var player ="red";
var playersID=[];
const Rooms=[];
var countRooms=0
app.set('view engine', 'ejs');

// Define a route for the game page.
app.get('/game', (req, res) => {
  res.render('game.ejs');
});
app.get('/', (req, res) => {
 res.render('index');
});


app.get('/game/:roomId', (req, res) => {
  


  // Join the room.
  const socket = io.sockets.connected[socket.id];
  socket.join(roomId);
  
  // Redirect the user to the game page.
  //res.redirect('/game');
});

class Room{
  constructor(roomName,uid=[],turn="red")
  {
    this.uid = uid;
    this.roomName=roomName;
    this.turn = turn;
  }
}


io.sockets.on('connection', (socket)=>{
  socket.on("mhere", function(roomName) {
    let roomExist = false;
    for (let i = 0; i < Rooms.length; i++) {
      if (Rooms[i].roomName === roomName) {
        if (Rooms[i].uid.length < 2) {
          Rooms[i].uid.push(socket.id);
          if (Rooms[i].uid.length==2){
            io.to(Rooms[i].uid[1]).emit('player',"red","red",i);
            io.to(Rooms[i].uid[0]).emit('player',"red","yellow",i);
          }
        }
        roomExist = true;
        break;
      }
    }
    if (!roomExist) {
      Rooms.push(new Room(roomName, []));
      Rooms[Rooms.length - 1].uid.push(socket.id);
    }
    console.log(Rooms);
  });
  socket.on("disconnect", function(){
    for (let i = 0; i < Rooms.length; i++) {
      for(let j =0;j<Rooms[i].uid.length;j++)
        if (Rooms[i].uid[j]=== socket.id) {
          Rooms[i].uid.splice(Rooms[i].uid.indexOf(socket.id),1)
          break;
        }
    }
  })
  
  socket.on('joinRoom', function(roomName) {
    var roomFull=false;
    for (let i = 0; i < Rooms.length; i++) { 
      if (Rooms[i].roomName === roomName) {
        if (Rooms[i].uid.length >= 2) {
          socket.emit("roomFull", roomName);
          roomFull=true;
        }
        else{
          socket.emit("roomJoined", roomName);
        }
        break;
      }
    }
    if(!roomFull){
      socket.emit("roomJoined", roomName);
    }
    
    
    
  });
  socket.on("enter",(col,row,room)=>{
    if(player=="red"){
      player="yellow"
    }
    else{
      player="red"
    }
    console.log(player)
    //io.emit("turn",player);
    io.to(Rooms[room].uid[0]).emit("turn",player,col,row);
    io.to(Rooms[room].uid[1]).emit("turn",player,col,row);
  })


  socket.on("win",function(player,room){
    
    io.to(Rooms[room].uid[0]).emit("win!",player);
    io.to(Rooms[room].uid[1]).emit("win!",player);
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
