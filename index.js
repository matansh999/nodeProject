const express = require('express'); //Import the express dependency
const port = 7777;                  //Save the port number where your server will be listening
const app = express();//Instantiate an express app, the main work horse of this server
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require('path');
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const router = express.Router();


router.get('/',function(req,res){
  res.render("index", {
      cunt:639
    });
}); 

io.on('connection', (socket) => {
  console.log('a user connected');
});

router.post('/login',function(req,res){
  const { uname, passwd } = req.body;

  if (uname === "admin" && passwd === "admin") {
    res.render("success", {
      uname: uname,
    });
  } else {
    err++;
    res.render("login", {
      uname: uname,
      err: err,
    });
  }
});


//add the router
app.use('/', router);


server.listen(port,() => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});