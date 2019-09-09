const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const { hri } = require("human-readable-ids");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage, deleteImage } = require("./external/imgur");
const {
  runAPISafely,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const Group = require("../../models/Group");
const { GroupType } = require("../../models/GroupType");
const User = require("../../models/User");

// @route   POST api/group/list
// @desc    Get a given group type's list of groups
// @access  Public
router.post("/list", (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupTypeName } = req.body;

    const groupType = await GroupType.findOne({
      nameLower: groupTypeName
    }).lean();

    if (!groupType) {
      return errors.addErrAndSendResponse(res, "Invalid Group Type Name");
    }

    const query = buildQuery(req, groupType.groups);
    let groups = await getGroups(query);
    sortGroups(req, groups);

    const response = { groupType, groups };

    res.json(response);
  });
});

const buildQuery = (req, groupIds) => {
  const { searchTerms } = req.body;
  const query = { _id: { $in: groupIds } };

  if (searchTerms) {
    query.$text = { $search: searchTerms };
  }

  return query;
};

const getGroups = async query => {
  let groups = await Group.find(query, {
    score: { $meta: "textScore" }
  })
    .sort({
      score: { $meta: "textScore" }
    })
    .lean();

  if (!!query.$text) {
    groups = groups.filter(group => group.score > 1);
  }

  return groups;
};

const sortGroups = (req, groups) => {
  const { sortBy } = req.body;

  switch (sortBy) {
    case "New": {
      groups.sort((a, b) => {
        return b.creationTimestamp.getTime() - a.creationTimestamp.getTime();
      });
      break;
    }
    case "Start Time": {
      groups.sort((a, b) => {
        return a.time.getTime() - b.time.getTime();
      });
      break;
    }
    case "Size": {
      groups.sort((a, b) => {
        return a.users.length - b.users.length;
      });
      break;
    }
    case "Nearby": {
      groups.sort((a, b) => {
        return 1;
      });
      break;
    }
    default: {
      break;
    }
  }
};

// @route   POST api/group/
// @desc    Get group by HRID (human readable id)
// @access  Private
router.post("/", auth, (req, res) => {
  const errors = new APIerrors();
  const { HRID } = req.body;

  runAPISafely(async () => {
    checkIfAllowedIn(req);

    const group = await Group.findOne({ HRID: HRID }).select("-users -admins");

    if (!group) {
      return errors.addErrAndSendResponse(res, "Group does not exist");
    }

    const groupType = await GroupType.findById(group.groupType);
    if (!groupType) {
      return errors.addErrAndSendResponse(
        res,
        "Group is linked to non-existent group type"
      );
    }

    const response = { group, groupType };

    res.json(response);
  });
});

const checkIfAllowedIn = async req => {
  let { HRID, userCurrentGroupHRID } = req.body;

  if (!userCurrentGroupHRID) {
    const user = await User.findById(req.user.id).select("currentGroup");
    userCurrentGroupHRID = user.currentGroup.HRID;
  }

  if (userCurrentGroupHRID && userCurrentGroupHRID !== HRID) {
    userCurrentGroup = await Group.findOne({ HRID: userCurrentGroupHRID });
    if (userCurrentGroup.creator.equals(req.user.id)) {
      console.log("send error here");
    }
  }
};

// @route   POST api/group
// @desc    Create a group
// @access  Private
router.post(
  "/",
  [upload.single("image"), auth, validateRequest("createGroup")],
  (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    createOrUpdateGroup(req, res, false);
  }
);

// @route   PUT api/group
// @desc    Update a group
// @access  Private
router.put("/:id", [auth, validateRequest("updateGroup")], (req, res) => {
  createOrUpdateGroup(req, res, true);
});

const createOrUpdateGroup = async (req, res, updating) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const groupFields = buildGroupFields(req, updating);
    const groupType = await GroupType.findById(groupFields.groupType);
    let response = {};

    if (!groupType) {
      return errors.addErrAndSendResponse(res, "Invalid Group Type ID");
    }

    response = { groupType };

    if (updating) {
      response.group = await updateGroup(req, groupFields, errors);
    } else {
      response.group = await createGroup(req, groupFields, errors);
    }

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
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

const updateGroup = async (req, groupFields, errors) => {
  //TODO delete this after confirming other update method works ok
  // for (const key of Object.keys(groupFields)) {
  //   group[key] = groupFields[key];
  // }

  // const group = await Group.findByIdAndUpdate(
  //   req.params.id,
  //   { $set: groupFields },
  //   { new: true }
  // );

  const group = await Group.findById(req.params.id);

  if (!group) {
    errors.addError("Invalid Group ID");
    return;
  }

  if (
    group.users.filter(user => {
      user.id === req.user.id;
    })[0].memberType !== "admin"
  ) {
    errors.addError("You do not have permission to update this group");
    return;
  }

  for (const key of Object.keys(groupFields)) {
    group[key] = groupFields[key];
  }

  await handleImageUpload(group, req, errors, true);
  if (errors.isNotEmpty()) return;

  await group.save();
  return group;
};

const createGroup = async (req, groupFields, errors) => {
  if (!!(await Group.findOne({ creator: req.user.id }))) {
    errors.addError(
      "Unable to create group: User already has an active group",
      "alert"
    );
    return;
  }

  const group = new Group(groupFields);
  group.users.push({
    id: req.user.id,
    memberType: "admin"
  });

  await assignUniqueHRID(group, errors);
  await handleGroupCreationSideEffects(group, req, groupFields, errors);
  await handleImageUpload(group, req, errors, false);

  if (errors.isNotEmpty()) return;

  await group.save();

  return group;
};

const assignUniqueHRID = async (group, errors) => {
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
    errors.addError("Unable to generate unique HRID");
  }

  group.HRID = HRID;
};

const handleGroupCreationSideEffects = async (
  group,
  req,
  groupFields,
  errors
) => {
  const groupType = await GroupType.findById(groupFields.groupType);
  if (!groupType) {
    errors.addError("Unable to find group type");
    return;
  }
  groupType.groups.push(group.id);
  await groupType.save();

  const creator = await User.findById(req.user.id);
  if (!creator) {
    errors.addError("Unable to find user");
    return;
  }
  creator.currentGroup = { HRID: group.HRID, name: group.name };
  await creator.save();
};

const handleImageUpload = async (group, req, errors, updating = false) => {
  if (req.file) {
    let uploadResponse = {};

    if (updating && group.image && !!group.image.deleteHash) {
      const updateImageResponse = await updateImage(
        req.file,
        group.image.deleteHash
      );
      uploadResponse = updateImageResponse.uploadResponse;
    } else {
      uploadResponse = await uploadImage(req.file);
    }

    if (uploadResponse.error) {
      errors.addError(
        `Unable to ${
          updating ? "update" : "create"
        } group: Image upload failed with error [${uploadResponse.error}]`
      );
    } else {
      group.image = uploadResponse;
    }
  }
};

// @route   DELETE api/group
// @desc    Delete a group
// @access  Private
router.delete("/", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const group = await Group.findOne({ creator: req.user.id });

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }
    await handleGroupDeletionSideEffects(group, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    await group.remove();

    res.status(200).json({ msg: "Group deleted" });
  });
});

const handleGroupDeletionSideEffects = async (group, errors) => {
  const groupType = await GroupType.findById(group.groupType);

  // Get group index and splice it out from group type list
  const groupIndex = groupType.groups.indexOf(group.id);

  if (groupIndex === -1) {
    errors.addError("Unable to remove group from group type list");
    return;
  }

  groupType.groups.splice(groupIndex, 1);
  await groupType.save();

  if (group.image && !!group.image.deleteHash) {
    const deleteResponse = await deleteImage(group.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    }
  }

  //TODO This will probably be taken care of by the socket event
  await User.findByIdAndUpdate(group.creator, {
    $set: {
      currentGroup: null
    }
  });
};

// @route   PUT api/group/notification/:groupId
// @desc    Add a notification to a group
// @access  Private
router.put(
  "/notification/:groupId",
  [auth, validateRequest("addNotification")],
  async (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      const { groupId } = req.params;
      const notification = await buildNotification(req, errors);
      const group = await Group.findById(groupId);

      if (!group) {
        return errors.addErrAndSendResponse(res, "Unable to find group");
      }

      if (
        group.users.filter(user => {
          user.id === req.user.id;
        })[0].memberType !== "admin"
      ) {
        return errors.addErrAndSendResponse(
          res,
          "You do not have permission to add a notification to this group"
        );
      }

      group.notifications.push(notification);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await group.save();

      res.json(group);
    });
  }
);

const buildNotification = async (req, errors) => {
  const { authorId, body } = req.body;
  let { authorName } = req.body;

  if (authorName === undefined) {
    let user = await User.findById(authorId).select("name");

    if (!user) {
      errors.addError("Unable to find user from given author ID");
      return;
    }
    authorName = user.name;
  }

  const author = { id: authorId, name: authorName };
  return { author, body };
};

// @route   DELETE api/group/notification/:groupId/:notifId
// @desc    Remove a notification from a group
// @access  Private
router.delete("/notification/:groupId/:notifId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    if (
      group.users.filter(user => {
        user.id === req.user.id;
      })[0].memberType !== "admin"
    ) {
      return errors.addErrAndSendResponse(
        res,
        "You do not have permission to remove a notification from this group"
      );
    }

    const notifIndex = getNotifIndex(group, notifId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }
    group.notifications.splice(notifIndex, 1);

    await group.save();

    res.json(group);
  });
});

// @route   PUT api/group/notification/:groupId/like/:notifId
// @desc    Like a notification
// @access  Private
router.put("/notification/:groupId/like/:notifId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    if (!group.users.includes(req.user.id)) {
      return errors.addErrAndSendResponse(
        res,
        "You must be a group member to like this notification"
      );
    }

    const notifIndex = getNotifIndex(group, notifId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }
    const notification = group.notifications[notifIndex];

    if (notification.likes.includes(req.user.id)) {
      return errors.addErrAndSendResponse(res, "Notification already liked");
    }

    notification.likes.unshift(req.user.id);

    await group.save();

    res.json(notification.likes);
  });
});

// @route   PUT api/group/notification/:groupId/unlike/:notifId
// @desc    Unlike a notification
// @access  Private
router.put("/notification/:groupId/unlike/:notifId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, notifId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    if (
      group.users.filter(user => {
        user.id === req.user.id;
      }).length < 1
    ) {
      return errors.addErrAndSendResponse(
        res,
        "You must be a group member to unlike this notification"
      );
    }

    const notifIndex = getNotifIndex(group, notifId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    const notification = group.notifications[notifIndex];
    const likeIndex = notification.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      return errors.addErrAndSendResponse(
        res,
        "Notification has not yet been liked"
      );
    }

    notification.likes.splice(likeIndex, 1);

    await group.save();

    res.json(notification.likes);
  });
});

const getNotifIndex = (group, notifId, errors) => {
  const notifIndex = group.notifications
    .map(notif => notif.id)
    .indexOf(notifId);

  if (notifIndex === -1) {
    errors.addError("Invalid notification id");
  }

  return notifIndex;
};

module.exports = router;
