module.exports = (io, socket) => {
  if (
    !socket.request.session.passport ||
    !socket.request.session.passport.user
  ) {
    return;
  }

  const username = socket.request.session.passport.user;

  console.log("a user connected " + socket.id + " " + username);

  io.emit("user connected", username);

  socket.on("disconnect", () => {
    io.emit("disconnected", username);
    console.log(`${username} disconnected`);
  });
};
