const Message = require("../models/Message");

module.exports = (io, socket) => {
  Message.find()
    .exec()
    .then((data) => {
      socket.emit("load", data);
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);

    const newMessage = new Message({
      message: `${msg.user}: ${msg.msg}`,
    });
    newMessage.save();
  });
};
