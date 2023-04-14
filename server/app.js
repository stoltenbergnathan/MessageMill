const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8347;
require("dotenv").config();
const parser = require("body-parser");
const userRouter = require("./routes/userRoute");
const mongoose = require("mongoose");
const passport = require("./routes/passport").passport;
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MONGODB CONNECTED");
});

app.use(userRouter);
app.use(parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "login.html"));
});

app.get("/index", ensureAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/groupchat", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "groupchat.html"));
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const io = require("socket.io")(server);
io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  socket.user = user;
  next();
});

const userSockets = require("./sockets/userSocket");
const mainChatSockets = require("./sockets/mainChatSocket");
const groupChatSockets = require("./sockets/groupSocket");

const onConnection = (socket) => {
  userSockets(io, socket);
  mainChatSockets(io, socket);
  groupChatSockets(io, socket);
};

io.on("connection", onConnection);
