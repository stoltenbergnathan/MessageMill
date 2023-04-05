module.exports = (io, socket) => {
  console.log("a user connected " + socket.id + " " + socket.user);

  io.emit("user connected", socket.user);

  socket.on("disconnect", () => {
    io.emit("disconnected", socket.user);
    console.log(`${socket.user} disconnected`);
  });
};
