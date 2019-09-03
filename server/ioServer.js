const socketIo = require("socket.io");
const http = require("http");
const moment = require("moment");

const User = require("../models/User");
const Group = require("../models/Group");

const ioServer = app => {
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", socket => {
    console.log("New client connected");

    new socketHandler(io, socket);
  });

  return server;
};

class socketHandler {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.group = null;
    this.userId = null;

    this.socket.on("setUserId", userId => (this.userId = userId));
    this.socket.on("joinGroup", groupId => this.joinGroup(groupId));
    this.socket.on("sendMessage", message => this.sendMessage(message));
    this.socket.on("disconnect", () => this.disconnect());
  }

  async sendMessage(message) {
    //TODO validate user token, maybe check for profanity
    const user = await User.findById(message.user).select("name id");

    this.io.in(this.group).emit("receiveMessage", {
      body: message.body,
      user: { name: user.name, id: user.id },
      time: moment().format("h:mm A")
    });
  }

  async joinGroup(groupId) {
    if (!groupId || !this.userId) return;

    if (!!this.group) {
      await this.leaveGroup(this.group);
    }

    const newGroup = await Group.findById(groupId);
    newGroup.users.push(this.userId);
    await newGroup.save();

    this.group = groupId;
    this.socket.join(groupId);

    this.io.in(groupId).emit("updateGroupMembers", {
      groupId,
      users: newGroup.users
    });
  }

  async leaveGroup(groupId) {
    this.socket.leave(groupId);

    const oldGroup = await Group.findById(groupId);

    let userIdIndex = oldGroup.admins.indexOf(this.userId);
    if (userIdIndex > -1) {
      oldGroup.admins.splice(userIdIndex, 1);
    }

    userIdIndex = oldGroup.users.indexOf(this.userId);
    if (userIdIndex > -1) {
      oldGroup.users.splice(userIdIndex, 1);
    }

    await oldGroup.save();

    this.io.in(groupId).emit("updateGroupMembers", {
      groupId: groupId,
      users: oldGroup.users
    });
  }

  async disconnect() {
    if (!!this.group) {
      await this.leaveGroup(this.group);
    }
  }
}

module.exports = ioServer;
