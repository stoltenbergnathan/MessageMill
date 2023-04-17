const Group = require("../models/Group");
const Message = require("../models/Message");
const mongoose = require("mongoose");

module.exports = (io, socket) => {
  Group.find()
    .exec()
    .then((data) => {
      socket.emit("group load", data);
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on("group add", (value) => {
    const newGroup = new Group({
      groupname: `${value}`,
    });
    newGroup.save();
    socket.emit("server group", {
      groupname: newGroup.groupname,
      id: newGroup.id,
    });
  });

  socket.on("group change", (value) => {
    socket.join(`${value}`);
    Message.find()
      .where({ room: value })
      .exec()
      .then((data) => {
        socket.emit("groupm load", data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("group message", (data) => {
    const username = socket.request.session.passport.user;

    const newMessage = new Message({
      sender: username,
      message: data.message,
      room: data.room,
    });

    newMessage.save();
    io.emit("group message", newMessage);
  });
};
