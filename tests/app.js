const express = require('express')
const app = express()
require("dotenv").config()


app.get('/', (req, res) => {
    res.sendStatus(200)
    res.sendFile(__dirname + '/login.html');
});

app.get('/index',(req, res) => {
  res.sendStatus(200)
  res.sendFile(__dirname + '/index.html');
});

app.get('/directchat', (req, res) => {
  res.sendStatus(200)
  res.sendFile(__dirname + '/directchat.html');
});

app.get('/groupchat', (req, res) => {
  res.sendStatus(200)
  res.sendFile(__dirname + '/groupchat.html');
});


module.exports = app