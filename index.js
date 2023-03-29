const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const parser = require("body-parser");
const port = process.env.PORT || 8347;

require("dotenv").config();

const mongoose = require("mongoose");
const Users = require("./models/Users");
const { connect } = require("http2");

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

require("./models/Message");
require("./models/Users");
require("./models/Group");
const Message = mongoose.model("Message");
const U = mongoose.model("User");
const Group = mongoose.model("Group");

passport.serializeUser(U.serializeUser());
passport.deserializeUser(U.deserializeUser());
app.use(
  session({
    secret: "Welcome",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(U.authenticate()));

app.use(parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

app.post("/register", (req, res) => {
  console.log("Username: " + req.body.username);
  console.log("Password: " + req.body.password);
  U.register(
    new U({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.sendFile(__dirname + "/login.html");
      }
      passport.authenticate("local")(req, res, () => {
        res.sendFile(__dirname + "/index.html");
      });
    }
  );
});

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/groupchat", (req, res) => {
  res.sendFile(__dirname + "/groupchat.html");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.sendFile(__dirname + "/login.html");
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

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id + " " + socket.user);

  Message.find()
    .exec()
    .then((data) => {
      socket.emit("load", data);
    })
    .catch((err) => {
      console.log(err);
    });

  Group.find()
    .exec()
    .then((data) => {
      socket.emit("group load", data);
    })
    .catch((err) => {
      console.log(err);
    });

  U.find()
    .exec()
    .then((data) => {
      socket.emit("user load", data);
    })
    .catch((err) => {
      console.log(err);
    });

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.user,
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);

    const newMessage = new Message({
      message: `${msg.user}: ${msg.msg}`,
    });
    newMessage.save();
  });

  socket.on("group add", (value) => {
    console.log(value);
    const newGroup = new Group({
      groupname: `${value}`,
    });
    newGroup.save();
    socket.broadcast.emit("server group", value);
  });

  socket.on("group change", (value) => {
    console.log(value);
    socket.join(`${value}`);
    Group.findOne({ groupname: `${value}` })
      .exec()
      .then((data) => {
        socket.emit("groupm load", data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("group message", (msg) => {
    Group.updateOne(
      { groupname: msg.group },
      { $addToSet: { messages: [`${msg.user}: ${msg.msg}`] } }
    )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    io.sockets.in(`${msg.group}`).emit("group message", msg);
  });

  socket.on("direct select", (sender, reciever) => {
    console.log(sender + " -> " + reciever);
    U.findOne({ username: `${value}` })
      .exec()
      .then((data) => {
        socket.emit("private load", data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("dsend", (sender, reciever, msg) => {});

  socket.on("disconnect", () => {
    io.emit("disconnected", socket.user);
    console.log(`${socket.user} disconnected`);
  });
});
