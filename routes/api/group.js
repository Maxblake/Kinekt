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
    const error = {};
    let response = {};

    if (!groupType) {
      error.msg = "Group Type ID is invalid";
    } else {
      // TODO make sure only creator and admins can update
      response = { groupTypeName: groupType.name };

      if (updating) {
        response.group = await updateGroup(req, groupFields, error);
      } else {
        response.group = await createGroup(req, groupFields, error);
      }
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

  let groupFields = {};

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
  //TODO delete this after confirming other update method works ok
  // for (const key of Object.keys(groupFields)) {
  //   group[key] = groupFields[key];
  // }

  const group = await Group.findByIdAndUpdate(
    req.params.id,
    { $set: groupFields },
    { new: true }
  );

  if (!group) {
    error.msg = "Unable to find group";
    return;
  }

  if (await handleImageUpload(group, req, error, true)) {
    await group.save();
  }

  return group;
};

const createGroup = async (req, groupFields, error) => {
  if (!!(await Group.findOne({ creator: req.user.id }))) {
    error.msg = "Unable to create group: User already has an active group";
    return;
  }

  const group = new Group(groupFields);

  await assignUniqueHRID(group, error);
  await handleGroupCreationSideEffects(group, req, groupFields, error);
  await handleImageUpload(group, req, error, false);

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

const handleImageUpload = async (group, req, error, updating = false) => {
  if (req.file) {
    let imageResponse = {};

    if (updating && group.image) {
      const updateImageResponse = await updateImage(
        req.file,
        group.image.deleteHash
      );
      imageResponse = updateImageResponse.uploadResponse;
    } else {
      imageResponse = await uploadImage(req.file);
    }

    if (imageResponse.error) {
      error.msg = `Unable to create group type: Image upload failed with error [${
        imageResponse.error
      }]`;
      return false;
    }

    group.image = imageResponse;
  }
  return true;
};

// @route   DELETE api/group
// @desc    Delete a group
// @access  Private
router.delete("/", auth, async (req, res) => {
  runAPISafely(async () => {
    const group = await Group.findOne({ creator: req.user.id });
    const error = {};

    if (!group) {
      error.msg = "Unable to find group";
    } else {
      await handleGroupDeletionSideEffects(group, error);
      await group.remove();
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }

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

    runAPISafely(async () => {
      const { groupId } = req.params;
      const error = {};
      const notification = await buildNotification(req, error);
      const group = await Group.findById(groupId);

      if (!group) {
        error.msg = "Unable to find group";
      }

      group.notifications.push(notification);

      if (!!error.msg) {
        return res.status(400).json(error);
      }

      await group.save();

      res.json(group);
    });
  }
);

const buildNotification = async (req, error) => {
  const { authorId, body } = req.body;
  let { authorName } = req.body;

  if (authorName === undefined) {
    let user = await User.findById(authorId).select("name");

    if (!user) {
      error.msg = "Unable to find user from given author ID";
      return {};
    }
    authorName = user.name;
  }

  const author = { id: authorId, name: authorName };
  return { author, body };
};

// @route   DELETE api/group/notification/:groupId/:notifId
// @desc    Remove a notification from a group
// @access  Private
//TODO make sure only group admins or author can delete notifications
router.delete("/notification/:groupId/:notifId", auth, async (req, res) => {
  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const error = {};
    const group = await Group.findById(groupId);

    if (!group) {
      error.msg = "Unable to find group";
    } else {
      const notifIndex = getNotifIndex(group, notifId, error);

      if (notifIndex !== -1) {
        group.notifications.splice(notifIndex, 1);

        await group.save();
        res.json(group);
      }
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }
  });
});

// @route   PUT api/group/notification/:groupId/like/:notifId
// @desc    Like a notification
// @access  Private
//TODO make sure only group members can like notifications
router.put("/notification/:groupId/like/:notifId", auth, async (req, res) => {
  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const error = {};
    const group = await Group.findById(groupId);

    if (!group) {
      error.msg = "Unable to find group";
    } else {
      const notifIndex = getNotifIndex(group, notifId, error);

      if (notifIndex !== -1) {
        const notification = group.notifications[notifIndex];

        // Check if notification has already been liked
        if (notification.likes.includes(req.user.id)) {
          error.msg = "Notification already liked";
          return res.status(400).json(error);
        }

        notification.likes.unshift(req.user.id);

        await group.save();

        res.json(notification.likes);
      }
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }
  });
});

// @route   PUT api/group/notification/:groupId/unlike/:notifId
// @desc    Unlike a notification
// @access  Private
//TODO make sure only group members can unlike notifications
router.put("/notification/:groupId/unlike/:notifId", auth, async (req, res) => {
  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const error = {};
    const group = await Group.findById(groupId);

    if (!group) {
      error.msg = "Unable to find group";
    } else {
      const notifIndex = getNotifIndex(group, notifId, error);

      if (notifIndex !== -1) {
        const notification = group.notifications[notifIndex];
        const likeIndex = notification.likes.indexOf(req.user.id);

        if (likeIndex === -1) {
          error.msg = "Notification has not yet been liked";
          return res.status(400).json(error);
        }

        notification.likes.splice(likeIndex, 1);

        await group.save();

        res.json(notification.likes);
      }
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }
  });
});

const getNotifIndex = (group, notifId, error) => {
  const notifIndex = group.notifications
    .map(notif => notif.id)
    .indexOf(notifId);

  if (notifIndex === -1) {
    error.msg = "Invalid notification id";
  }

  return notifIndex;
};

module.exports = router;
