const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { hri } = require("human-readable-ids");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const jwt = require("jsonwebtoken");
const config = require("config");
const { getDistance } = require("geolib");

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
  }, res);
});

const buildQuery = (req, groupIds) => {
  const { searchTerms, seenGroups } = req.body;
  const query = {
    _id: { $in: groupIds.filter(id => !seenGroups.includes(id.toString())) },
    accessLevel: { $ne: "Private" }
  };

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
    .limit(8)
    .select("-notices -users")
    .lean();

  if (!!query.$text) {
    groups = groups.filter(group => group.score > 1);
  }

  return groups;
};

const sortGroups = (req, groups) => {
  const { sortBy, sortDir } = req.body;
  const sortDirInt = sortDir === "Ascending" ? 1 : -1;

  switch (sortBy) {
    case "New": {
      groups.sort((a, b) => {
        return (
          sortDirInt *
          (b.creationTimestamp.getTime() - a.creationTimestamp.getTime())
        );
      });
      break;
    }
    case "Start Time": {
      groups.sort((a, b) => {
        return sortDirInt * (a.time.getTime() - b.time.getTime());
      });
      break;
    }
    case "Spots left": {
      groups.sort((a, b) => {
        if (a.maxSize) {
          if (b.maxSize) {
            const aSpotsLeft = a.maxSize - a.users.length;
            const bSpotsLeft = b.maxSize - b.users.length;

            return sortDirInt * (aSpotsLeft - bSpotsLeft);
          }
          return sortDirInt * -1;
        }
        return sortDirInt;
      });
      break;
    }
    case "Nearby": {
      const { userLocation } = req.body;

      if (userLocation !== undefined) {
        groups.sort((a, b) => {
          if (a.place.lat) {
            if (b.place.lat) {
              const distanceToA = getDistance(
                { lat: userLocation.lat, lng: userLocation.lng },
                { lat: a.place.lat, lng: a.place.lng }
              );
              const distanceToB = getDistance(
                { lat: userLocation.lat, lng: userLocation.lng },
                { lat: b.place.lat, lng: b.place.lng }
              );
              return sortDirInt * (distanceToA - distanceToB);
            }
            return sortDirInt * -1;
          }
          return sortDirInt;
        });
      }
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
router.post("/HRID", auth, (req, res) => {
  const errors = new APIerrors();
  const { HRID } = req.body;

  runAPISafely(async () => {
    const group = await Group.findOne({ HRID: HRID }).lean();

    if (!group) {
      const user = await User.findById(req.user.id).select("currentGroup");
      if (user.currentGroup.HRID === HRID) {
        user.currentGroup = null;
        await user.save();
        return errors.addErrAndSendResponse(
          res,
          "Heads up! Your current group was removed or has expired",
          "alert-warning"
        );
      }

      return errors.addErrAndSendResponse(res, "Group does not exist", "alert");
    }

    await isUserAllowedIn(req, group, errors);
    delete group.users;

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    const groupType = await GroupType.findById(group.groupType).select(
      "-groups"
    );
    if (!groupType) {
      return errors.addErrAndSendResponse(
        res,
        "Group is linked to non-existent group type"
      );
    }

    const response = { group, groupType };

    res.json(response);
  }, res);
});

const isUserAllowedIn = async (req, group, errors) => {
  let { HRID, userCurrentGroupHRID, joinKey } = req.body;

  if (
    group.maxSize &&
    group.users.length >= group.maxSize &&
    !group.users.find(groupUser => groupUser.id.equals(req.user.id))
  ) {
    errors.addError(`'${group.name}' is currently full`, "alert-warning");
    return;
  }

  if (
    group.bannedUsers &&
    group.bannedUsers.find(bannedUser => bannedUser.toString() === req.user.id)
  ) {
    errors.addError(`You are banned from '${group.name}'`, "alert");
    return;
  }

  if (!userCurrentGroupHRID) {
    const user = await User.findById(req.user.id).select("currentGroup");
    userCurrentGroupHRID = user.currentGroup.HRID;
  }

  if (userCurrentGroupHRID && userCurrentGroupHRID !== HRID) {
    userCurrentGroup = await Group.findOne({ HRID: userCurrentGroupHRID });
    if (userCurrentGroup && userCurrentGroup.creator.equals(req.user.id)) {
      errors.addError(
        "You must delete your current group before joining a new one",
        "alert-warning"
      );
      return;
    }
  }

  if (
    group.accessLevel !== "Public" &&
    !group.users.find(groupUser => groupUser.id.equals(req.user.id))
  ) {
    if (!joinKey) {
      errors.addError("", "alert-requestEntry", {
        groupName: group.name,
        HRID: group.HRID,
        groupId: group._id
      });
      return;
    } else {
      const decoded = jwt.verify(
        joinKey,
        process.env.jwtSecret || config.get("jwtSecret")
      );
      if (decoded.userId !== req.user.id) {
        errors.addError("Cannot join group: invalid token", "alert", {
          groupName: group.name,
          HRID: group.HRID,
          groupId: group._id
        });
        return;
      }
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
    createOrUpdateGroup(req, res, false);
  }
);

// @route   PUT api/group
// @desc    Update a group
// @access  Private
router.put(
  "/:id",
  [upload.single("image"), auth, validateRequest("updateGroup")],
  (req, res) => {
    createOrUpdateGroup(req, res, true);
  }
);

const createOrUpdateGroup = async (req, res, updating) => {
  const errors = new APIerrors();

  if (errors.addExpressValidationResult(req))
    return errors.sendErrorResponse(res);

  runAPISafely(async () => {
    const groupFields = buildGroupFields(req, updating);
    let group = null;
    let groupType = null;
    let user = null;

    if (updating) {
      [group, user] = await updateGroup(req, groupFields, errors);
      groupType = group
        ? await GroupType.findById(group.groupType).select("-groups")
        : null;
    } else {
      groupType = await GroupType.findById(groupFields.groupType).select(
        "-groups"
      );
      [group, user] = await createGroup(req, groupFields, errors);
    }

    if (!updating && !groupType) {
      errors.addError("Invalid Group Type ID");
    }

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    return res.json({ group, groupType, groupLocks: user.groupLocks });
  }, res);
};

const buildGroupFields = (req, updating) => {
  const {
    name,
    description,
    placeAddress,
    placeLat,
    placeLng,
    accessLevel,
    time,
    maxSize
  } = req.body;
  const groupTypeId = req.body.groupType;

  let groupFields = {};

  if (name) groupFields.name = name;
  if (!updating && groupTypeId) groupFields.groupType = groupTypeId;
  if (placeAddress)
    groupFields.place = {
      address: placeAddress,
      lat: placeLat,
      lng: placeLng
    };
  if (accessLevel) groupFields.accessLevel = accessLevel;
  if (!updating) groupFields.creator = req.user.id;
  if (description) groupFields.description = description;
  if (time) groupFields.time = time;
  if (maxSize) groupFields.maxSize = maxSize;

  return groupFields;
};

const updateGroup = async (req, groupFields, errors) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    errors.addError("Invalid Group ID");
    return [null, null];
  }

  if (groupFields.maxSize && group.users.length > groupFields.maxSize) {
    errors.addError(
      "Max group size cannot be smaller than the current number of members",
      "maxSize"
    );
    return [null, null];
  }

  const currentUser = group.users.filter(groupUser => {
    return groupUser.id.equals(req.user.id);
  })[0];

  if (!currentUser || currentUser.memberType !== "admin") {
    errors.addError("You do not have permission to update this group", "alert");
    return [null, null];
  }

  const updatingUser = await User.findById(req.user.id);
  if (
    !group.usedLock &&
    group.accessLevel === "Public" &&
    groupFields.accessLevel !== "Public"
  ) {
    if (updatingUser.groupLocks < 1) {
      errors.addError(
        `You need at least 1 group lock in order to create a ${groupFields.accessLevel.toLowerCase()} group`,
        "alert"
      );
      return [null, null];
    } else {
      updatingUser.groupLocks = updatingUser.groupLocks - 1;
      group.usedLock = true;
      await updatingUser.save();
    }
  }

  for (const key of Object.keys(groupFields)) {
    group[key] = groupFields[key];
  }

  await handleImageUpload(group, req, errors, true);
  if (errors.isNotEmpty()) return [null, null];

  await group.save();
  return [group, updatingUser];
};

const createGroup = async (req, groupFields, errors) => {
  if (!!(await Group.findOne({ creator: req.user.id }))) {
    errors.addError(
      "Unable to create group: User already has an active group",
      "alert"
    );
    return [null, null];
  }

  const creator = await User.findById(req.user.id);
  if (groupFields.accessLevel !== "Public" && creator.groupLocks < 1) {
    errors.addError(
      `You need at least 1 group lock in order to create a ${groupFields.accessLevel.toLowerCase()} group`,
      "alert"
    );
    return [null, null];
  }

  const group = new Group(groupFields);
  group.users.push({
    id: req.user.id,
    memberType: "admin"
  });

  await assignUniqueHRID(group, errors);
  await handleGroupCreationSideEffects(group, req, groupFields, errors);
  await handleImageUpload(group, req, errors, false);

  if (errors.isNotEmpty()) return [null, null];

  await group.save();

  return [group, creator];
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
  if (groupFields.accessLevel !== "Public") {
    creator.groupLocks = creator.groupLocks - 1;
    group.usedLock = true;
  }
  await creator.save();
};

const handleImageUpload = async (group, req, errors, updating = false) => {
  if (req.file) {
    let uploadResponse = {};

    if (updating && group.image && !!group.image.deleteHash) {
      const updateImageResponse = await updateImage(
        req.file,
        group.image.deleteHash,
        353,
        706
      );
      uploadResponse = updateImageResponse.uploadResponse;
    } else {
      uploadResponse = await uploadImage(req.file, 706, 353);
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
  } else if (
    req.body.image === "REMOVE" &&
    updating &&
    group.image &&
    !!group.image.deleteHash
  ) {
    const deleteResponse = await deleteImage(group.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    } else {
      group.image = undefined;
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
  }, res);
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

  await User.updateMany(
    {
      _id: { $in: group.users.map(user => user._id) }
    },
    {
      $set: {
        currentGroup: null
      }
    }
  );
};

// @route   PUT api/group/notice/:groupId
// @desc    Add a notice to a group
// @access  Private
router.put(
  "/notice/:groupId",
  [auth, validateRequest("addNotice")],
  async (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      const { groupId } = req.params;
      const notice = await buildNotice(req, errors);
      const group = await Group.findById(groupId);

      if (!group) {
        return errors.addErrAndSendResponse(res, "Unable to find group");
      }

      const currentUser = group.users.filter(groupUser => {
        return groupUser.id.equals(req.user.id);
      })[0];

      if (!currentUser) {
        errors.addError(
          "You do not have permission to add a notice to this group",
          "alert"
        );
      }

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      group.notices.unshift(notice);
      await group.save();

      res.json(group.notices);
    }, res);
  }
);

const buildNotice = async (req, errors) => {
  const { authorId, body } = req.body;
  return { authorId, body };
};

// @route   DELETE api/group/notice/:groupId/:noticeId
// @desc    Remove a notice from a group
// @access  Private
router.delete("/notice/:groupId/:noticeId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, noticeId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    const noticeIndex = getNoticeIndex(group, noticeId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    const currentUser = group.users.filter(groupUser => {
      return groupUser.id.equals(req.user.id);
    })[0];

    if (
      !currentUser ||
      (currentUser.memberType !== "admin" &&
        !currentUser.id.equals(group.notices[noticeIndex].authorId))
    ) {
      errors.addError(
        "You do not have permission to remove a notice from this group",
        "alert"
      );
    }

    group.notices.splice(noticeIndex, 1);
    await group.save();

    res.json(group.notices);
  }, res);
});

// @route   PUT api/group/notice/:groupId/toggle-like/:noticeId
// @desc    Like or unlike a notice
// @access  Private
router.put("/notice/:groupId/toggle-like/:noticeId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, noticeId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    if (!group.users.find(groupUser => groupUser.id.equals(req.user.id))) {
      return errors.addErrAndSendResponse(
        res,
        "You must be a group member to like or unlike this notice"
      );
    }

    const noticeIndex = getNoticeIndex(group, noticeId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }
    const notice = group.notices[noticeIndex];
    const likeIndex = notice.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      notice.likes.push(req.user.id);
    } else {
      notice.likes.splice(likeIndex, 1);
    }

    await group.save();

    res.json(group.notices);
  }, res);
});

// @route   PUT api/group/notice/:groupId/unlike/:noticeId
// @desc    Unlike a notice
// @access  Private
router.put("/notice/:groupId/unlike/:noticeId", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { groupId, noticeId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return errors.addErrAndSendResponse(res, "Unable to find group");
    }

    if (!group.users.find(groupUser => groupUser.id.equals(req.user.id))) {
      return errors.addErrAndSendResponse(
        res,
        "You must be a group member to unlike this notice"
      );
    }

    const noticeIndex = getNoticeIndex(group, noticeId, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    const notice = group.notices[noticeIndex];
    const likeIndex = notice.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      return errors.addErrAndSendResponse(res, "Notice has not yet been liked");
    }

    notice.likes.splice(likeIndex, 1);
    await group.save();

    res.json(group.notices);
  }, res);
});

const getNoticeIndex = (group, noticeId, errors) => {
  const noticeIndex = group.notices.map(notice => notice._id).indexOf(noticeId);

  if (noticeIndex === -1) {
    errors.addError("Invalid notice id");
  }

  return noticeIndex;
};

module.exports = router;
