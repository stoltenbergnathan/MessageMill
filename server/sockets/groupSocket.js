const Group = require("../models/Group");

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
};
