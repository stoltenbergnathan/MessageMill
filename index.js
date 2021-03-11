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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });

app.get('/index.html?', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const io = require('socket.io')(server)
require("./models/Message")
const Message = mongoose.model("Message")

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);

        const newMessage = new Message({
            message: `${msg.user}: ${msg.msg}`
        })
    newMessage.save();
      });

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });
