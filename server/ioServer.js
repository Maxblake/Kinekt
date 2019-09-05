const socketIo = require("socket.io");
const http = require("http");
const moment = require("moment");

const User = require("../models/User");
const Group = require("../models/Group");
const { GroupType } = require("../models/GroupType");

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
    this.user = null;

    this.socket.on("setUser", userId => this.setUser(userId));
    this.socket.on("joinGroup", groupId => this.joinGroup(groupId));
    this.socket.on("sendMessage", message => this.sendMessage(message));
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("getGroupAndUserNumbers", groupAndGroupTypeIds =>
      this.getGroupAndUserNumbers(groupAndGroupTypeIds)
    );
  }

  async setUser(userId) {
    const user = await User.findById(userId);
    this.user = user;
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
    if (!groupId || !this.user) return;

    if (!!this.group) {
      await this.leaveGroup(this.group, true);
    }

    const newGroup = await Group.findById(groupId);
    newGroup.users.push({ id: this.user._id, memberType: "user" });
    await newGroup.save();

    this.group = groupId;
    this.socket.join(groupId);

    this.io.in(this.group).emit("receiveMessage", {
      body: `${this.user.name} has joined the group.`,
      user: { id: 0 },
      time: moment().format("h:mm A")
    });

    this.updateCurrentGroup(newGroup);
    this.updateGroupMembers(newGroup);
  }

  async leaveGroup(groupId, joiningNewGroup) {
    this.socket.leave(groupId);

    const oldGroup = await Group.findById(groupId);

    oldGroup.users = oldGroup.users.filter(user => {
      user.id !== this.user._id;
    });

    await oldGroup.save();

    this.io.in(this.group).emit("receiveMessage", {
      body: `${this.user.name} has left the group.`,
      user: { id: 0 },
      time: moment().format("h:mm A")
    });

    this.updateCurrentGroup({}, !joiningNewGroup);
    this.updateGroupMembers(oldGroup);
  }

  async updateGroupMembers(group) {
    const userIds = group.users.map(user => {
      return user.id;
    });

    const users = await User.find({
      _id: { $in: userIds }
    })
      .select("name about image")
      .lean();

    const admins = group.users.filter(user => {
      user.memberType === "admin";
    });

    users.forEach(user => {
      if (admins.includes(user._id)) {
        user.memberType = "admin";
      } else {
        user.memberType = "user";
      }
    });

    this.io.in(group._id.toString()).emit("updateGroupMembers", {
      groupId: group._id.toString(),
      users
    });
  }

  async updateCurrentGroup(group, shouldEmit = true) {
    this.user.currentGroup = {
      name: group.name,
      HRID: group.HRID
    };

    if (shouldEmit) {
      this.socket.emit("updateCurrentGroup", this.user.currentGroup);
    }
  }

  //TODO clean up everything having to do with this
  async getGroupAndUserNumbers(groupAndGroupTypeIds) {
    const groupAndUserNumbers = {};

    if (!!groupAndGroupTypeIds.groups) {
      const groups = await Group.find({
        _id: { $in: groupAndGroupTypeIds.groups }
      })
        .select("users maxSize")
        .lean();

      let groupNumbersMap = {};

      for (const group of groups) {
        groupNumbersMap[group._id] = {
          users: group.users.length,
          maxSize: group.maxSize
        };
      }

      groupAndUserNumbers.groupNumbersMap = groupNumbersMap;
    }

    if (!!groupAndGroupTypeIds.groupTypes) {
      const groupTypes = await GroupType.find({
        _id: { $in: groupAndGroupTypeIds.groupTypes }
      })
        .select("groups")
        .lean();

      let groupTypeNumbersMap = {};

      for (const groupType of groupTypes) {
        const groups = await Group.find({
          _id: { $in: groupType.groups }
        })
          .select("users")
          .lean();

        let users = 0;
        for (const group of groups) {
          users += group.users.length;
        }

        groupTypeNumbersMap[groupType._id] = {
          groups: groupType.groups.length,
          users: users
        };
      }

      groupAndUserNumbers.groupTypeNumbersMap = groupTypeNumbersMap;
    }

    if (
      !!groupAndGroupTypeIds.groupType &&
      (groupAndUserNumbers.groupTypeNumbersMap &&
        !groupAndUserNumbers.groupTypeNumbersMap[
          groupAndGroupTypeIds.groupType
        ])
    ) {
      const groupType = await GroupType.findById(groupAndGroupTypeIds.groupType)
        .select("groups")
        .lean();

      const groups = await Group.find({
        _id: { $in: groupType.groups }
      })
        .select("users")
        .lean();

      let users = 0;
      for (const group of groups) {
        users += group.users.length;
      }

      groupAndUserNumbers.groupTypeNumbersMap[
        groupAndGroupTypeIds.groupType
      ] = {
        groups: groupType.groups.length,
        users: users
      };
    }

    this.socket.emit("setGroupAndUserNumbers", groupAndUserNumbers);
  }

  async disconnect() {
    if (!!this.user) {
      await this.user.save();
    }

    if (!!this.group) {
      await this.leaveGroup(this.group);
    }
  }
}

module.exports = ioServer;
