const socketIo = require("socket.io");
const http = require("http");
const moment = require("moment");

const User = require("../models/User");

const ioServer = app => {
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", socket => {
    console.log("New client connected");

    socket.join("defaultGroup");

    socket.on("sendMessage", async message => {
      //TODO validate user token, maybe check for profanity
      const user = await User.findById(message.user).select("name id");

      io.in("defaultGroup").emit("receiveMessage", {
        body: message.body,
        user: { name: user.name, id: user.id },
        time: moment().format("h:mm A")
      });
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  return server;
};

module.exports = ioServer;
