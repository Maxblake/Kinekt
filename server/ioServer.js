const socketIo = require("socket.io");
const http = require("http");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");

const { getTempUserToken } = require("../routes/api/helpers/helpers");

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

  //scheduleGroupExpirations(io);
  //setInterval(() => scheduleGroupExpirations(io), 1000 * 60 * 30);
  setTimeout(() => scheduleGroupExpirations(io), 2000);

  return server;
};

class socketHandler {
  constructor(io, socket, userStatusMap) {
    this.socket = socket;
    this.io = io;
    this.userStatusMap = userStatusMap;
    this.groupId = null;
    this.isAuthenticated = false;
    this.user = null;
    this.userStatusTimeout = null;

    this.socket.on("setUser", userToken => this.setUser(userToken));
    this.socket.on("joinGroup", groupId => this.joinGroup(groupId));
    this.socket.on("leaveCurrentGroup", () => this.leaveCurrentGroup());
    this.socket.on("leaveSocket", () => this.leaveSocket());
    this.socket.on("requestEntry", groupId => this.requestEntry(groupId));
    this.socket.on("answerEntryRequest", ({ answer, userId }) =>
      this.answerEntryRequest(answer, userId)
    );
    this.socket.on("kickFromGroup", payload => this.kickFromGroup(payload));
    this.socket.on("toggleGroupAdmin", userId => this.toggleGroupAdmin(userId));
    this.socket.on("setUserStatus", userStatus =>
      this.setUserStatus(userStatus)
    );
    this.socket.on("preDeleteGroupActions", () => this.preDeleteGroupActions());
    this.socket.on("sendMessage", message => this.sendMessage(message));
    this.socket.on("logout", () => this.logout());
    this.socket.on("getGroupAndUserNumbers", groupAndGroupTypeIds =>
      this.getGroupAndUserNumbers(groupAndGroupTypeIds)
    );
    this.socket.on("getGroupNotices", notices => this.getGroupNotices(notices));
  }

  async setUser(userToken) {
    const decoded = jwt.verify(userToken, config.get("jwtSecret"));

    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) {
      this.isAuthenticated = false;
      return;
    }

    this.isAuthenticated = true;
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
    if (!groupId || !this.isAuthenticated) return;
    this.user = await User.findById(this.user._id);

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
      await this.leaveCurrentGroup(true);
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

    this.updateGroupNotices(newGroup.notices.toObject());
    this.setUserStatus("active");
  }

  async requestEntry(groupId) {
    if (!this.isAuthenticated) return;
    this.user = await User.findById(this.user._id);

    this.io.in(`group-${groupId}`).emit("entryRequestReceived", {
      id: this.user._id,
      name: this.user.name,
      about: this.user.about,
      image: this.user.image
    });
  }

  async answerEntryRequest(answer, userId) {
    if (!this.isAuthenticated) return;

    const group = await Group.findById(this.groupId).select("HRID");
    let joinKey = undefined;

    if (answer === "Accepted") {
      joinKey = jwt.sign({ userId }, config.get("jwtSecret"));
    }

    this.socket
      .to(`user-${userId}`)
      .emit("entryRequestAnswered", { answer, joinKey, HRID: group.HRID });
  }

  async leaveCurrentGroup(joiningNewGroup = false) {
    const oldGroup = await Group.findOne({
      HRID: this.user.currentGroup.HRID
    });

    this.leaveSocket();
    this.updateCurrentGroup(null, !joiningNewGroup);

    if (!oldGroup || this.user._id.equals(oldGroup.creator)) return;

    oldGroup.users = oldGroup.users.filter(user => {
      return !user.id.equals(this.user._id);
    });

    await oldGroup.save();

    this.io.in(`group-${oldGroup._id.toString()}`).emit("receiveMessage", {
      body: `${this.user.name} has left the group.`,
      user: { id: 0 },
      time: moment().format("h:mm A")
    });

    this.updateGroupMembers(oldGroup);
  }

  leaveSocket() {
    if (!this.groupId) return;

    this.socket.leave(`group-${this.groupId.toString()}`);
  }

  async updateGroupMembers(group) {
    if (!this.isAuthenticated) return;

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

  getGroupNotices(notices) {
    this.updateGroupNotices(notices);
  }

  async updateGroupNotices(passedNotices = null) {
    if (!this.groupId || !this.isAuthenticated) return;

    let notices = passedNotices;
    const updatedNotices = [];

    if (notices === null) {
      const group = await Group.findById(this.groupId)
        .select("notices")
        .lean();
      notices = group.notices;
    }

    if (!notices) return;

    for (const notice of notices) {
      const user = await User.findById(notice.authorId);

      updatedNotices.push({
        ...notice,
        authorImage: user.image ? user.image.link : "",
        authorName: user.name
      });
    }

    this.io
      .in(`group-${this.groupId.toString()}`)
      .emit("updateGroupNotices", updatedNotices);
  }

  async updateCurrentGroup(group, shouldEmit = true) {
    if (!this.isAuthenticated) return;

    if (group) {
      this.user.currentGroup = {
        name: group.name,
        HRID: group.HRID
      };
    } else {
      this.user.currentGroup = null;
    }

    await this.user.save();

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
    //TODO uncommented for debug only
    //this.socket.emit("setGroupAndUserNumbers", groupAndUserNumbers);
  }

  async kickFromGroup({ userId, isBanned, allUsers }) {
    if (!this.isAuthenticated) return;

    const group = await Group.findById(this.groupId);
    if (!group || group.creator.equals(userId)) {
      return;
    }

    if (
      isBanned &&
      group.bannedUsers.filter(bannedUserId => bannedUserId.equals(userId))
        .length < 1
    ) {
      group.bannedUsers.push(userId);
      await group.save();
    }

    if (
      group.users.filter(
        user => user.id.equals(this.user._id) && user.memberType === "admin"
      ).length < 1
    ) {
      return;
    }

    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroup", { allUsers, userId });
    this.socket
      .to(`group-${this.groupId.toString()}`)
      .emit("kickedFromGroupAlert", { isBanned, allUsers, userId });

    if (allUsers) {
      for (const groupUser of group.users) {
        const user = await User.findById(groupUser.id);
        await this.handleKickSideEffects(group, user);
      }
    }

    if (!!userId) {
      const user = await User.findById(userId);

      this.handleKickSideEffects(group, user);
      this.updateGroupMembers(group);

      this.io.in(`group-${this.groupId.toString()}`).emit("receiveMessage", {
        body: `${user.name} has been ${
          isBanned ? "banned" : "kicked"
        } from the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });
    }
  }

  async handleKickSideEffects(group, user) {
    group.users = group.users.filter(groupUser => {
      return !groupUser.id.equals(user._id);
    });
    await group.save();

    user.currentGroup = null;
    await user.save();
  }

  async toggleGroupAdmin(userId) {
    if (!this.isAuthenticated) return;

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

  async preDeleteGroupActions() {
    await this.kickFromGroup({ userId: null, allUsers: true });
    this.updateCurrentGroup(null, false);

    this.socket.emit("preDeleteActionsComplete");
  }

  logout() {
    this.leaveSocket();
    this.groupId = null;
    this.isAuthenticated = false;
    this.user = null;
    this.userStatusTimeout = null;
  }
}

const scheduleGroupExpirations = async io => {
  const expiringGroups = await Group.find({
    creationTimestamp: { $lt: moment().subtract(60 * 23 + 30, "minutes") }
  });

  const expirationCutoff = moment().subtract(24, "hours");

  expiringGroups.forEach(group => {
    const creationTime = moment(group.creationTimestamp);
    const diff = creationTime.diff(expirationCutoff);
    const diffDuration = moment.duration(diff);
    const timeToExpiration = diffDuration.asMilliseconds();

    setTimeout(
      () => expireGroup(group, io),
      timeToExpiration < 0 ? 0 : timeToExpiration
    );
  });
};

const expireGroup = (group, io) => {
  //TODO dev only comment
  const tempToken = "Bad token"; //getTempUserToken(group.creator.toString());
  const config = {
    headers: {
      "x-auth-token": tempToken
    }
  };

  axios
    .delete("http://localhost:5000/api/group", config)
    .catch(err => console.error(err.message));

  io.in(`group-${group._id.toString()}`).emit("kickedFromGroup", {
    allUsers: true
  });
  io.in(`group-${group._id.toString()}`).emit("groupExpired");
};

module.exports = ioServer;
