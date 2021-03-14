# Message Mill

## Introduction

> This project allows users to talk to each other in real time using websockets. This project taught me how to use express, HTML, bootstrap, socketio, passport, mongoDB, mongoose, and overall JS.

## Code Samples

>Examples

>---------------------------------------------------------------------------------------------------------

Express.js

```javascript

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', passport.authenticate('local', {successRedirect: '/index', failureRedirect: '/'}),
  (req, res) => {
    
});

app.post('/register', (req, res) => {
  console.log("Username: " + req.body.username)
  console.log("Password: " + req.body.password)
  U.register(new U({username: req.body.username,}), req.body.password, (err, user) => {
    if(err){
      console.log(err)
      res.sendFile(__dirname + '/login.html')
    }
    passport.authenticate("local")(req, res, () => {
      res.sendFile(__dirname + '/index.html')
    })
  })
})

```

Mongoose.js

```javascript

const mongoose = require("mongoose")
const Users = require('./models/Users')
const { connect } = require('http2')
mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true})

mongoose.connection.on("error", (err) => {
    console.log("ERROR: " + err.message)
})

mongoose.connection.once("open", () => {
    console.log("MONGODB CONNECTED")
})

require("./models/Message")
require("./models/Users")
require("./models/Group")
const Message = mongoose.model("Message")
const U = mongoose.model("User")
const Group = mongoose.model("Group")

```

HTML & Bootstrap

```HTML

 <body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">MessageMill</a>
        </div>
        <ul class="nav navbar-nav">
          <li><a href="./directchat">Direct Messages</a></li>
          <li><a href="./groupchat">Chat Rooms</a></li>
          <li><a href="./logout">Logout</a></li>
        </ul>
      </div>
    </nav>
    <div>
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
      </form>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const username = document.cookie;

        var socket = io({
          auth: {
            user: username
          }
        });

      
        var messages = document.getElementById('messages');
        var form = document.getElementById('form');
        var input = document.getElementById('input');
        var ulist = document.getElementById('users');

      
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          if (input.value) {
            socket.emit('chat message', {msg: input.value, user: username});
            input.value = '';
          }
        });

```

>Starting

tpye npm start into terminal
