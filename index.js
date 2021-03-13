//https://cs300project.herokuapp.com/

const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

require("dotenv").config()

const mongoose = require("mongoose")
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/directchat.html', (req, res) => {
  res.sendFile(__dirname + '/directchat.html');
});

app.get('/groupchat.html', (req, res) => {
  res.sendFile(__dirname + '/groupchat.html');
});

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

    const newUser = new U({
      username: socket.user
    })
    newUser.save();
    
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

      socket.on('direct page', () => {
        U.find((err, data) => {
          if(err)
            console.log(err)
          else
            socket.emit('userlist', data)
        });
      })

    socket.on('disconnect', () => {
        io.emit('disconnected', socket.user)
        U.deleteMany({username: socket.user}, (err, data) => {
          if(err)
            console.log(err)
          else
            console.log(data)
        })
        console.log(`${socket.user} disconnected`);
      });
  });
