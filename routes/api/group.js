const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const { hri } = require("human-readable-ids");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage, deleteImage } = require("./external/imgur");
const { runAPISafely } = require("./helpers/helpers");

const Group = require("../../models/Group");
const { GroupType } = require("../../models/GroupType");
const User = require("../../models/User");

// @route   POST api/group/list
// @desc    Get a given group type's list of groups
// @access  Public
router.post("/list", (req, res) => {
  runAPISafely(async () => {
    const { groupTypeName } = req.body;
    if (!groupTypeName) {
      return res.status(400).json({
        msg: "Invalid Group Type Name"
      });
    }

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
  });
});

// @route   GET api/group/:HRID
// @desc    Get group by HRID (human readable id)
// @access  Private
router.get("/:HRID", auth, (req, res) => {
  runAPISafely(async () => {
    const group = await Group.findOne({ HRID: req.params.HRID });

    if (!group) {
      return res.status(400).json({ msg: "Group does not exist" });
    }

    const groupType = await GroupType.findById(group.groupType).select("name");
    const response = { group, groupTypeName: groupType.name };

    res.json(response);
  });
});

// @route   POST api/group
// @desc    Create a group
// @access  Private
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
  runAPISafely(async () => {
    const groupFields = buildGroupFields(req, updating);
    const groupType = await GroupType.findById(groupFields.groupType);

    if (!groupType) {
      return res.status(401).json({
        msg: "Group Type ID is invalid"
      });
    }

    // TODO make sure only creator and admins can update
    let response = { groupTypeName: groupType.name };
    const error = {};

    if (updating) {
      response.group = await updateGroup(req, groupFields, error);
    } else {
      response.group = await createGroup(req, groupFields, error);
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }

    return res.json(response);
  });
};

const buildGroupFields = (req, updating) => {
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

  const groupFields = {};

  if (name) groupFields.name = name;
  if (!updating && groupTypeId) groupFields.groupType = groupTypeId;
  if (place) groupFields.place = place;
  if (accessLevel) groupFields.accessLevel = accessLevel;
  if (!updating) groupFields.creator = req.user.id;
  if (description) groupFields.description = description;
  if (time) groupFields.time = time;
  if (minSize) groupFields.minSize = minSize;
  if (maxSize) groupFields.maxSize = maxSize;

  return groupFields;
};

const updateGroup = async (req, groupFields, error) => {
  const group = await Group.findById(req.params.id);

  for (const key of Object.keys(groupFields)) {
    group[key] = groupFields[key];
  }

  if (req.file) {
    const updateImageResponse = await updateImage(
      req.file,
      group.image.deleteHash
    );
    const uploadResponse = updateImageResponse.uploadResponse;
    if (uploadResponse.error) {
      error.msg = uploadResponse.error;
      return;
    }
    group.image = uploadResponse;

    await group.save();

    return group;
  }
};

const createGroup = async (req, groupFields, error) => {
  if (!!(await Group.findOne({ creator: req.user.id }))) {
    error.msg = "Unable to create group: User already has an active group";
    return;
  }

  const group = new Group(groupFields);

  await assignUniqueHRID(group, error);
  await handleGroupCreationSideEffects(group, req, groupFields, error);

  if (!!error.msg) return;

  await group.save();

  return group;
};

const assignUniqueHRID = async (group, error) => {
  let i = 0;
  let uniqueHRIDFound = false;
  let HRID = "";

  while (i < 50 && !uniqueHRIDFound) {
    HRID = hri.random();
    if (await Group.findOne({ HRID })) {
      i += 1;
      continue;
    }
    uniqueHRIDFound = true;
  }

  if (!uniqueHRIDFound) {
    error.msg = "Unable to generate unique HRID";
  }

  group.HRID = HRID;
};

const handleGroupCreationSideEffects = async (
  group,
  req,
  groupFields,
  error
) => {
  if (req.file) {
    const uploadResponse = await uploadImage(req.file);
    if (uploadResponse.error) {
      error.msg = uploadResponse.error;
      return;
    }
    group.image = uploadResponse;
  }

  const groupType = await GroupType.findById(groupFields.groupType);
  if (!groupType) {
    error.msg = "Unable to find group type";
    return;
  }
  groupType.groups.push(group.id);
  await groupType.save();

  const creator = await User.findById(req.user.id);
  if (!creator) {
    error.msg = "Unable to find user";
    return;
  }
  creator.currentGroup = group.id;
  await creator.save();
};

// @route   DELETE api/group
// @desc    Delete a group
// @access  Private
router.delete("/", auth, async (req, res) => {
  runAPISafely(async () => {
    const group = await Group.findOne({ creator: req.user.id });
    const error = {};

    await handleGroupDeletionSideEffects(group, error);

    if (!!error.msg) {
      return res.status(400).json(error);
    }

    await group.remove();
    res.json({ msg: "Group deleted" });
  });
});

const handleGroupDeletionSideEffects = async (group, error) => {
  const groupType = await GroupType.findById(group.groupType);

  // Get group index and splice it out from group type list
  const groupIndex = groupType.groups.indexOf(group.id);

  if (groupIndex === -1) {
    error.msg = "Unable to remove group from group type list";
    return;
  }

  groupType.groups.splice(groupIndex, 1);
  await groupType.save();

  if (group.image) {
    const deleteResponse = await deleteImage(group.image.deleteHash);
    if (deleteResponse.error) {
      error.msg = deleteResponse.error;
    }
  }
};

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
