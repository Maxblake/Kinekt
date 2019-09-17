const socketIo = require("socket.io");
const http = require("http");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");
const Group = require("../models/Group");
const { GroupType } = require("../models/GroupType");

const ioServer = app => {
  const server = http.createServer(app);
  const io = socketIo(server);

  const userStatusMap = {};

  io.on("connection", socket => {
    console.log("New client connected");

    new socketHandler(io, socket, userStatusMap);
  });

  return server;
};

class socketHandler {
  constructor(io, socket, userStatusMap) {
    this.socket = socket;
    this.io = io;
    this.userStatusMap = userStatusMap;
    this.groupId = null;
    this.user = null;
    this.userStatusTimeout = null;

    this.socket.on("setUser", userId => this.setUser(userId));
    this.socket.on("joinGroup", groupId => this.joinGroup(groupId));
    this.socket.on("leaveCurrentGroup", payload =>
      this.leaveCurrentGroup(payload)
    );
    this.socket.on("requestEntry", groupId => this.requestEntry(groupId));
    this.socket.on("answerEntryRequest", ({ answer, userId }) =>
      this.answerEntryRequest(answer, userId)
    );
    this.socket.on("kickFromGroup", kickedUser =>
      this.kickFromGroup(kickedUser)
    );
    this.socket.on("banFromGroup", bannedUser => this.banFromGroup(bannedUser));
    this.socket.on("toggleGroupAdmin", userId => this.toggleGroupAdmin(userId));
    this.socket.on("setUserStatus", userStatus =>
      this.setUserStatus(userStatus)
    );
    this.socket.on("groupDeleted", () => this.groupDeleted());
    this.socket.on("sendMessage", message => this.sendMessage(message));
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("getGroupAndUserNumbers", groupAndGroupTypeIds =>
      this.getGroupAndUserNumbers(groupAndGroupTypeIds)
    );
  }

  async setUser(userId) {
    const user = await User.findById(userId).select("-password");
    this.user = user;

    this.socket.join(`user-${user._id.toString()}`);

    if (this.user.currentGroup) {
      const currentGroup = await Group.findOne({
        HRID: this.user.currentGroup.HRID
      }).select("");

      this.groupId = currentGroup ? currentGroup._id : null;
    }
  }

  async sendMessage(message) {
    //TODO validate user token, maybe check for profanity
    const user = await User.findById(message.user).select("name id");

    this.io.in(`group-${this.groupId.toString()}`).emit("receiveMessage", {
      body: message.body,
      user: { name: user.name, id: user.id },
      time: moment().format("h:mm A")
    });
  }

  async joinGroup(groupId) {
    if (!groupId || !this.user) return;

    const newGroup = await Group.findById(groupId);

    if (this.user.currentGroup) {
      const currentGroup = await Group.findOne({
        HRID: this.user.currentGroup.HRID
      });

      if (
        currentGroup &&
        currentGroup.HRID !== newGroup.HRID &&
        this.user._id.equals(currentGroup.creator)
      ) {
        return;
      }
    }

    if (
      this.user.currentGroup.HRID &&
      this.user.currentGroup.HRID !== newGroup.HRID
    ) {
      await this.leaveCurrentGroup({ joiningNewGroup: true });
    }

    if (
      newGroup.users.filter(user => {
        return user.id.equals(this.user._id);
      }).length < 1
    ) {
      newGroup.users.push({ id: this.user._id, memberType: "user" });
      await newGroup.save();
    }

    this.groupId = newGroup._id;
    this.socket.join(`group-${this.groupId.toString()}`);

    if (this.user.currentGroup.HRID !== newGroup.HRID) {
      this.io.in(`group-${this.groupId.toString()}`).emit("receiveMessage", {
        body: `${this.user.name} has joined the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });

      this.updateCurrentGroup(newGroup);
    }

    this.setUserStatus("active");
  }

  async requestEntry(groupId) {
    this.io.in(`group-${groupId}`).emit("entryRequestReceived", {
      id: this.user._id,
      name: this.user.name,
      about: this.user.about,
      image: this.user.image
    });
  }

  async answerEntryRequest(answer, userId) {
    const group = await Group.findById(this.groupId).select("HRID");
    let joinKey = undefined;

    if (answer === "Accepted") {
      joinKey = jwt.sign({ userId }, config.get("jwtSecret"));
    }

    this.socket
      .to(`user-${userId}`)
      .emit("entryRequestAnswered", { answer, joinKey, HRID: group.HRID });
  }

  async leaveCurrentGroup(payload) {
    const { isKicked, joiningNewGroup } = payload;

    const oldGroup = await Group.findOne({
      HRID: this.user.currentGroup.HRID
    });

    if (!oldGroup || this.user._id.equals(oldGroup.creator)) return;

    this.socket.leave(`group-${oldGroup._id.toString()}`);
    this.updateCurrentGroup(null, !joiningNewGroup);

    oldGroup.users = oldGroup.users.filter(user => {
      return !user.id.equals(this.user._id);
    });

    await oldGroup.save();

    if (!isKicked) {
      this.io.in(`group-${oldGroup._id.toString()}`).emit("receiveMessage", {
        body: `${this.user.name} has left the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });
    }

    this.updateGroupMembers(oldGroup);
  }

  async updateGroupMembers(group) {
    const userMap = {};

    for (const user of group.users) {
      userMap[user.id] = user;
    }

    const users = await User.find({
      _id: { $in: Object.keys(userMap) }
    })
      .select("name about image")
      .lean();

    users.forEach(user => {
      user.memberType = userMap[user._id].memberType;
      user.status = this.userStatusMap[group._id]
        ? this.userStatusMap[group._id][user._id]
        : "idle";
    });

    this.io.in(`group-${group._id.toString()}`).emit("updateGroupMembers", {
      groupId: group._id.toString(),
      users
    });
  }

  async updateCurrentGroup(group, shouldEmit = true) {
    if (group) {
      this.user.currentGroup = {
        name: group.name,
        HRID: group.HRID
      };
    } else {
      this.user.currentGroup = null;
    }

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

    if (!!groupAndGroupTypeIds.groupType) {
      if (
        groupAndUserNumbers.groupTypeNumbersMap &&
        !groupAndUserNumbers.groupTypeNumbersMap[groupAndGroupTypeIds.groupType]
      ) {
        return;
      }

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

      const groupTypeNumbers = {
        groups: groupType.groups.length,
        users: users
      };

      if (groupAndUserNumbers.groupTypeNumbersMap) {
        groupAndUserNumbers.groupTypeNumbersMap[
          groupAndGroupTypeIds.groupType
        ] = groupTypeNumbers;
      } else {
        groupAndUserNumbers.groupTypeNumbersMap = {};
        groupAndUserNumbers.groupTypeNumbersMap[
          groupAndGroupTypeIds.groupType
        ] = groupTypeNumbers;
      }
    }

    this.socket.emit("setGroupAndUserNumbers", groupAndUserNumbers);
  }

  async kickFromGroup(kickedUser) {
    const group = await Group.findById(this.groupId);

    if (group.creator.equals(kickedUser.userId)) {
      return;
    }

    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroup", kickedUser);
    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroupAlert", { kickedUser });

    if (!kickedUser.allUsers) {
      const user = await User.findById(kickedUser.userId).select("name");

      this.io.in(`group-${this.groupId.toString()}`).emit("receiveMessage", {
        body: `${user.name} has been kicked from the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });
    }
  }

  async banFromGroup(bannedUser) {
    const group = await Group.findById(this.groupId);

    if (group.creator.equals(bannedUser.userId)) {
      return;
    }

    if (
      group.bannedUsers.filter(user => {
        return user.id.equals(this.user._id);
      }).length < 1
    ) {
      group.bannedUsers.push(bannedUser.userId);
      await group.save();
    }

    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroup", bannedUser);
    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroupAlert", { kickedUser: bannedUser, isBanned: true });

    const user = await User.findById(bannedUser.userId).select("name");

    this.io.in(`group-${this.groupId.toString()}`).emit("receiveMessage", {
      body: `${user.name} has been banned from the group.`,
      user: { id: 0 },
      time: moment().format("h:mm A")
    });
  }

  async toggleGroupAdmin(userId) {
    const group = await Group.findById(this.groupId);

    for (const user of group.users) {
      if (user.id.equals(userId)) {
        if (user.memberType === "admin") {
          user.memberType = "user";
        } else {
          user.memberType = "admin";
        }
        break;
      }
    }

    await group.save();
    this.updateGroupMembers(group);
  }

  async setUserStatus(userStatus) {
    const group = await Group.findById(this.groupId);

    if (!group) return;

    if (userStatus === "active") {
      clearTimeout(this.userStatusTimeout);
      this.userStatusTimeout = setTimeout(
        () => this.setUserStatus("idle"),
        1000 * 60 * 2
      );
    }

    if (!this.userStatusMap[group._id]) this.userStatusMap[group._id] = {};

    this.userStatusMap[group._id][this.user._id] = userStatus;

    this.updateGroupMembers(group);
  }

  groupDeleted() {
    this.kickFromGroup({ userId: null, allUsers: true });
    this.updateCurrentGroup(null, true);
  }

  async disconnect() {
    if (!!this.user) {
      await this.user.save();
    }
  }
}

module.exports = ioServer;
