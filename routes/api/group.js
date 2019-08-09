const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const { hri } = require("human-readable-ids");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage } = require("./external/imgur");

const Group = require("../../models/Group");
const { GroupType } = require("../../models/GroupType");
const User = require("../../models/User");

// @route   POST api/group/list
// @desc    Get a list of groups matching certain criteria
// @access  Public
//TODO return list by criteria, only return limited fields
router.post("/list", async (req, res) => {
  const { groupTypeName } = req.body;
  if (!groupTypeName) {
    return res.status(400).json({
      msg: "Invalid Group Type Name"
    });
  }

  try {
    const groupType = await GroupType.findOne({
      nameLower: groupTypeName
    }).lean();

    if (!groupType) {
      return res.status(400).json({
        msg: "Invalid Group Type Name"
      });
    }

    const groups = await Group.find({ _id: { $in: groupType.groups } });
    const response = { groupType, groups };
    res.json(response);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   GET api/group/:HRID
// @desc    Get group by HRID (human readable id)
// @access  Private
router.get("/:HRID", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ HRID: req.params.HRID });

    if (!group) {
      return res.status(400).json({ msg: "Group does not exist" });
    }
    const groupTypeName = await GroupType.findById(group.groupType).select(
      "name"
    );
    const response = { group, groupTypeName: groupTypeName.name };

    res.json(response);
  } catch (err) {
    console.error(err.message);

    //TODO maybe add this elsewhere
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Group does not exist" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   POST api/group
// @desc    Create a group
// @access  Private
// TODO fill in other required fields
router.post(
  "/",
  [
    upload.single("image"),
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("place", "Meeting place is required")
        .not()
        .isEmpty(),
      check("time", "Meeting time is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    createOrUpdateGroup(req, res, false);
  }
);

// @route   POST api/group
// @desc    Update a group
// @access  Private
router.post("/:id", (req, res) => {
  createOrUpdateGroup(req, res, true);
});

const createOrUpdateGroup = async (req, res, updating) => {
  const {
    name,
    description,
    place,
    accessLevel,
    time,
    minSize,
    maxSize
  } = req.body;
  const groupTypeId = req.body.groupType;

  try {
    if (!(await GroupType.findById(groupTypeId))) {
      return res.status(401).json({
        msg: "Group Type ID is invalid"
      });
    }

    // build group object
    const groupFields = {};

    if (name) groupFields.name = name;
    if (groupTypeId) groupFields.groupType = groupTypeId;
    if (place) groupFields.place = place;
    if (accessLevel) groupFields.accessLevel = accessLevel;
    if (!updating) groupFields.creator = req.user.id;
    if (description) groupFields.description = description;
    if (time) groupFields.time = time;
    if (minSize) groupFields.minSize = minSize;
    if (maxSize) groupFields.maxSize = maxSize;

    // TODO make sure only creator and admins can update
    let group = undefined;
    const response = {};

    if (updating) {
      // update
      /* group = await Group.findByIdAndUpdate(
        req.params.id,
        { $set: groupFields },
        { new: true }
      ); */
      group = await Group.findById(req.params.id);

      for (const key of Object.keys(groupFields)) {
        group[key] = groupFields[key];
      }

      if (req.file) {
        const updateResponse = await updateImage(
          req.file,
          group.image.deleteHash
        );
        group.image = updateResponse.uploadResponse;
      }

      const groupTypeName = await GroupType.findById(group.groupType).select(
        "name"
      );
      response = { group, groupTypeName: groupTypeName.name };

      await group.save();
    } else {
      // create
      group = await Group.findOne({ creator: req.user.id });

      if (group) {
        return res.status(402).json({
          msg: "Unable to create group: User already has an active group"
        });
      }

      // assign human readable id
      var i = 0;
      var uniqueHRIDFound = false;

      while (i < 50 && !uniqueHRIDFound) {
        groupFields.HRID = hri.random();
        if (await Group.findOne({ HRID: groupFields.HRID })) {
          i += 1;
          continue;
        }
        uniqueHRIDFound = true;
      }

      if (!uniqueHRIDFound) {
        return res.status(403).json({
          msg: "Unable to create group: Failed to generate unique HRID"
        });
      }

      group = new Group(groupFields);

      if (req.file) {
        group.image = await uploadImage(req.file);
      }

      const groupType = await GroupType.findById(groupTypeId);
      groupType.groups.push(group.id);

      const creator = await User.findById(req.user.id);

      if (!creator) {
        return res.status(404).json({
          msg: "User ID is invalid"
        });
      }

      creator.currentGroup = group.id;

      // save at the end of all API's, like this
      await group.save();
      await groupType.save();
      await creator.save();

      response.group = group;
      response.groupTypeName = groupType.name;
    }

    return res.json(response);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(405).json({ msg: "ID does not exist" });
    }

    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   DELETE api/group
// @desc    Delete a group
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ creator: req.user.id });
    const groupType = await GroupType.findById(group.groupType);

    // Get group index and splice it out from group type list
    const groupIndex = groupType.groups.indexOf(group.id);

    if (groupIndex === -1) {
      // TODO correct error code?
      return res
        .status(400)
        .json({ msg: "Unable to remove group from group type list" });
    }

    groupType.groups.splice(groupIndex, 1);
    await groupType.save();

    await Group.findOneAndDelete({ creator: req.user.id });
    res.json({ msg: "Group deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/group/notification/:groupId
// @desc    Add a notification to a group
// @access  Private
//TODO make sure only group admins can add notifications
router.put(
  "/notification/:groupId",
  [
    auth,
    [
      check("authorId", "Author id is required")
        .not()
        .isEmpty(),
      check("body", "Body is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { groupId } = req.params;
    var { authorId, authorName, body } = req.body;

    //TODO is this safe enough?
    if (authorName === undefined) {
      let user = await User.findById(authorId);
      authorName = user.name;
    }

    const author = { id: authorId, name: authorName };
    const notification = { author, body };

    try {
      const group = await Group.findById(groupId);
      group.notifications.push(notification);

      await group.save();

      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/group/notification/:groupId/:notifId
// @desc    Remove a notification from a group
// @access  Private
//TODO make sure only group admins or author can delete notifications
router.delete("/notification/:groupId/:notifId", auth, async (req, res) => {
  try {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    // Get notification index and splice it out
    const notifIndex = group.notifications
      .map(notif => notif.id)
      .indexOf(notifId);

    if (notifId === -1) {
      // TODO correct error code?
      return res.status(400).json({ msg: "Invalid notification id" });
    }

    group.notifications.splice(notifIndex, 1);

    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/group/notification/:groupId/like/:notifId
// @desc    Like a notification
// @access  Private
//TODO make sure only group members can like notifications
router.put("/notification/:groupId/like/:notifId", auth, async (req, res) => {
  try {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    // Get notification index
    const notifIndex = group.notifications
      .map(notif => notif.id)
      .indexOf(notifId);
    const notification = group.notifications[notifIndex];

    if (notification === undefined) {
      // TODO correct error code?
      return res.status(400).json({ msg: "Invalid notification id" });
    }

    // Check if notification has already been liked
    if (notification.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Notification already liked" });
    }

    notification.likes.unshift(req.user.id);

    await group.save();

    res.json(notification.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/group/notification/:groupId/unlike/:notifId
// @desc    Unlike a notification
// @access  Private
//TODO make sure only group members can unlike notifications
router.put("/notification/:groupId/unlike/:notifId", auth, async (req, res) => {
  try {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    // Get notification index
    const notifIndex = group.notifications
      .map(notif => notif.id)
      .indexOf(notifId);
    const notification = group.notifications[notifIndex];

    if (notification === undefined) {
      // TODO correct error code?
      return res.status(400).json({ msg: "Invalid notification id" });
    }

    const likeIndex = notification.likes.indexOf(req.user.id);

    // Check if notification has already been liked
    if (likeIndex === -1) {
      return res
        .status(400)
        .json({ msg: "Notification has not yet been liked" });
    }

    notification.likes.splice(likeIndex, 1);

    await group.save();

    res.json(notification.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
