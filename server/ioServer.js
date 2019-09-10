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
    this.socket.on("leaveCurrentGroup", payload =>
      this.leaveCurrentGroup(payload)
    );
    this.socket.on("kickFromGroup", userId => this.kickFromGroup(userId));
    this.socket.on("groupDeleted", () => this.groupDeleted());
    this.socket.on("sendMessage", message => this.sendMessage(message));
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("getGroupAndUserNumbers", groupAndGroupTypeIds =>
      this.getGroupAndUserNumbers(groupAndGroupTypeIds)
    );
  }

  async setUser(userId) {
    const user = await User.findById(userId);
    this.user = user;

    if (this.user.currentGroup) {
      const currentGroup = await Group.findOne({
        HRID: this.user.currentGroup.HRID
      });

      this.group = currentGroup;
    }
  }

  async sendMessage(message) {
    //TODO validate user token, maybe check for profanity
    const user = await User.findById(message.user).select("name id");

    this.io.in(this.group._id.toString()).emit("receiveMessage", {
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

    this.group = newGroup;
    this.socket.join(this.group._id.toString());

    if (this.user.currentGroup.HRID !== newGroup.HRID) {
      this.io.in(this.group._id.toString()).emit("receiveMessage", {
        body: `${this.user.name} has joined the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });

      this.updateCurrentGroup(newGroup);
    }

    this.updateGroupMembers(newGroup);
  }

  async leaveCurrentGroup(payload) {
    const { isKicked, joiningNewGroup } = payload;

    const oldGroup = await Group.findOne({
      HRID: this.user.currentGroup.HRID
    });

    if (!oldGroup) return;

    if (this.user._id.equals(oldGroup.creator)) {
      console.log("noeee");
      return;
    }

    this.socket.leave(oldGroup._id.toString());
    this.updateCurrentGroup(null, !joiningNewGroup);

    oldGroup.users = oldGroup.users.filter(user => {
      return !user.id.equals(this.user._id);
    });

    await oldGroup.save();

    if (!isKicked) {
      this.io.in(oldGroup._id.toString()).emit("receiveMessage", {
        body: `${this.user.name} has left the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });
    }

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

    const admins = group.users.map(user =>
      user.memberType === "admin" ? user.id : null
    );

    users.forEach(user => {
      if (admins.includes(user._id)) {
        user.memberType = "admin";
      } else {
        user.memberType = "user";
      }
    });
    console.log(admins);
    console.log(users);

    this.io.in(group._id.toString()).emit("updateGroupMembers", {
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
    console.log(typeof this.group.creator);
    console.log(typeof kickedUser.userId);
    if (this.group.creator.equals(kickedUser.userId)) {
      return;
    }

    this.socket
      .to(this.group._id.toString())
      .emit("kickedFromGroup", kickedUser);
    this.socket
      .to(this.group._id.toString())
      .emit("kickedFromGroupAlert", kickedUser);

    if (!kickedUser.allUsers) {
      const user = await User.findById(kickedUser.userId).select("name");

      this.io.in(this.group._id.toString()).emit("receiveMessage", {
        body: `${user.name} has been kicked from the group.`,
        user: { id: 0 },
        time: moment().format("h:mm A")
      });
    }
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
