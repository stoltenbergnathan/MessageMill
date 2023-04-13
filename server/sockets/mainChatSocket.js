const Message = require("../models/Message");

module.exports = (io, socket) => {
  Message.find()
    .exec()
    .then((data) => {
      console.log(data);
      socket.emit(
        "load",
        data.filter((d) => !d.room)
      );
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);

    const newMessage = new Message({
      sender: msg.user,
      message: msg.msg,
    });
    newMessage.save();
  });
};
