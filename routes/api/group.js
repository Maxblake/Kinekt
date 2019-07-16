const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Group = require("../../models/Group");
const User = require("../../models/User");

// @route   GET api/group/list
// @desc    Get a list of groups matching certain criteria
// @access  Public
//TODO return list by criteria, only return limited fields
router.get("/list", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/group/:id
// @desc    Get group by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(400).json({ msg: "Group does not exist" });
    }

    res.json(group);
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
// @desc    Create or update a group
// @access  Private

// TODO fill in other required fields
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("groupType", "Group Type is required")
        .not()
        .isEmpty(),
      check("meetingPlace", "Meeting place is required")
        .not()
        .isEmpty(),
      check("meetingTimeContext", "Meeting time context is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      groupType,
      name,
      description,
      meetingPlace,
      imageURL,
      meetingTimeContext,
      meetingTime,
      minSize,
      maxSize
    } = req.body;

    // build group object
    const groupFields = {};

    groupFields.creator = req.user.id;

    groupFields.name = name;
    groupFields.groupType = groupType;
    groupFields.meetingPlace = meetingPlace;
    groupFields.meetingTimeContext = meetingTimeContext;

    if (description) groupFields.description = description;
    if (imageURL) groupFields.imageURL = imageURL;
    if (meetingTime) groupFields.meetingTime = meetingTime;
    if (minSize) groupFields.minSize = minSize;
    if (maxSize) groupFields.maxSize = maxSize;

    try {
      // TODO make sure user only has one group at a time
      let group = await Group.findOne({ creator: req.user.id });

      if (group) {
        // update
        group = await Group.findOneAndUpdate(
          { creator: req.user.id },
          { $set: groupFields },
          { new: true }
        );
      } else {
        // create
        group = new Group(groupFields);
        await group.save();
      }

      return res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/group
// @desc    Delete a group
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
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
