const socketIo = require("socket.io");
const http = require("http");

const startIoServer = app => {
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", socket => {
    console.log("New client connected");

    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  server.listen(5001);
};

module.exports = startIoServer;
