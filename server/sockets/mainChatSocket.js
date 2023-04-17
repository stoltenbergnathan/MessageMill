const Message = require("../models/Message");

module.exports = (io, socket) => {
  Message.find()
    .exec()
    .then((data) => {
      socket.emit(
        "load",
        data.filter((d) => !d.room)
      );
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on("chat message", (msg) => {
    const username = socket.request.session.passport.user;

    const newMessage = new Message({
      sender: username,
      message: msg,
    });
    newMessage.save();

    io.emit("chat message", newMessage);
  });
};
