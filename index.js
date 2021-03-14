//https://cs300project.herokuapp.com/

const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const parser = require('body-parser')
const port = process.env.PORT || 6978

require("dotenv").config()

const mongoose = require("mongoose")
const Users = require('./models/Users')
mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true})

mongoose.connection.on("error", (err) => {
    console.log("ERROR: " + err.message)
})

mongoose.connection.once("open", () => {
    console.log("MONGODB CONNECTED")
})

require("./models/Message")
require("./models/Users")
const Message = mongoose.model("Message")
const U = mongoose.model("User")


passport.serializeUser(U.serializeUser());
passport.deserializeUser(U.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret:"Welcome",
  resave: false,
  saveUninitialized: false,
}))

passport.use(new LocalStrategy(U.authenticate()))

app.use(parser.urlencoded(
  {extended:true}
))

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

app.get('/index',(req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/directchat', (req, res) => {
  res.sendFile(__dirname + '/directchat.html');
});

app.get('/groupchat', (req, res) => {
  res.sendFile(__dirname + '/groupchat.html');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.sendFile(__dirname + '/login.html');
})

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const io = require('socket.io')(server)

io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  socket.user = user;
  next();
})

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id + ' ' + socket.user);

    Message.find((err, data) => {
      if(err)
        console.log(err)
      else
        socket.emit('load', data)
    });

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.user,
    })


    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);

        const newMessage = new Message({
            message: `${msg.user}: ${msg.msg}`
        })
    newMessage.save();
      });

    socket.on('disconnect', () => {
        io.emit('disconnected', socket.user)     
        console.log(`${socket.user} disconnected`);
      });
  });
