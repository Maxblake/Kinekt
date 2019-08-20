const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage, deleteImage } = require("./external/imgur");
const {
  runAPISafely,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const Group = require("../../models/Group");
const { GroupType, RequestedGroupType } = require("../../models/GroupType");

// @route   POST api/group-type/list
// @desc    Get a list of group types ordered and filtered by passed criteria
// @access  Public
router.post("/list", async (req, res) => {
  runAPISafely(async () => {
    const query = buildQuery(req);
    const groupTypes = await getGroupTypes(query);

    res.json(groupTypes);
  });
});

const buildQuery = req => {
  const { sortBy, category, searchTerms } = req.body;
  const query = {};

  if (category && category !== "All") query.category = category;
  if (searchTerms) {
    query.$text = { $search: searchTerms };
  }

  return query;
};

const getGroupTypes = async query => {
  let groupTypes = await GroupType.find(query, {
    score: { $meta: "textScore" }
  })
    .select("-groups")
    .sort({
      score: { $meta: "textScore" }
    })
    .lean();

  if (!!query.$text) {
    groupTypes = groupTypes.filter(groupType => groupType.score > 1);
  }

  return groupTypes;
};

// @route   GET api/group-type/:id
// @desc    Get a group type's name, description, and pertaining list of groups
// @access  Public
router.get("/:id", async (req, res) => {
  runAPISafely(async () => {
    const groupType = await GroupType.findById(req.params.id);
    res.json(groupType);
  });
});

// @route   POST api/group-type/request
// @desc    Request a group type
// @access  Private
router.post(
  "/request",
  [upload.single("image"), auth, validateRequest("requestGroupType")],
  async (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      if (await GroupType.findOne({ nameLower: req.body.name.toLowerCase() })) {
        return errors.addErrAndSendResponse(
          res,
          "Unable to create group type: Name is unavailable",
          "name"
        );
      } else if (await RequestedGroupType.findOne({ creator: req.user.id })) {
        return errors.addErrAndSendResponse(
          res,
          "Unable to create group type: User already has pending request",
          "alert"
        );
      }
      const groupTypeFields = buildGroupTypeFields(req);

      requestedGroupType = new RequestedGroupType(groupTypeFields);

      await handleImageUpload(requestedGroupType, req, errors, false);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await requestedGroupType.save();
      res.status(200).send("OK");
    });
  }
);

// **DEPRECATED**
// @route   POST api/group-type
// @desc    Create a group type
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("category", "Category is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category } = req.body;

    if (await GroupType.findOne({ nameLower: name.toLowerCase() })) {
      return res.status(400).json({
        msg: "Unable to create group type: Name is unavailable"
      });
    }

    // build group type object
    const groupTypeFields = {};

    groupTypeFields.name = name;
    groupTypeFields.category = category;
    if (description) groupTypeFields.description = description;

    try {
      // create
      const groupType = new GroupType(groupTypeFields);
      await groupType.save();

      return res.json(groupType);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/group-type/:id
// @desc    Update a group type
// @access  Private
router.put("/:id", validateRequest("updateGroupType"), async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const groupTypeFields = buildGroupTypeFields(req, true);

    const groupType = await GroupType.findByIdAndUpdate(
      req.params.id,
      { $set: groupTypeFields },
      { new: true }
    );

    if (!groupType) {
      return errors.addErrAndSendResponse(res, "Unable to find group type");
    }

    await handleImageUpload(groupType, req, errors, true);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    await groupType.save();
    return res.json(groupType);
  });
});

const buildGroupTypeFields = (req, updating = false) => {
  const { name, description, category } = req.body;
  let groupTypeFields = {};

  if (!updating) groupTypeFields.creator = req.user.id;
  if (name) groupTypeFields.name = name;
  if (description) groupTypeFields.description = description;
  if (category) groupTypeFields.category = category;

  return groupTypeFields;
};

const handleImageUpload = async (groupType, req, errors, updating = false) => {
  if (req.file) {
    let uploadResponse = {};

    if (updating && groupType.image && !!groupType.image.deleteHash) {
      const updateImageResponse = await updateImage(
        req.file,
        groupType.image.deleteHash
      );
      uploadResponse = updateImageResponse.uploadResponse;
    } else {
      uploadResponse = await uploadImage(req.file);
    }

    if (uploadResponse.error) {
      errors.addError(
        `Unable to ${
          updating ? "update" : "create"
        } group type: Image upload failed with error [${uploadResponse.error}]`
      );
    } else {
      groupType.image = uploadResponse;
    }
  }
};

// @route   DELETE api/group-type/:id
// @desc    Delete a group type
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    if (!req.isAdmin) {
      return errors.addErrAndSendResponse(
        res,
        "You do not have permission to delete this group type"
      );
    }

    const groupType = GroupType.findById(req.params.id);

    if (!groupType) {
      return errors.addErrAndSendResponse(res, "Unable to find group type");
    }

    await handleGroupTypeDeletionSideEffects(groupType, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    await groupType.remove();

    return res.status(200).json({ msg: "Group type deleted" });
  });
});

const handleGroupTypeDeletionSideEffects = async (groupType, errors) => {
  if (groupType.image && !!groupType.image.deleteHash) {
    const deleteResponse = await deleteImage(groupType.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    }
  }

  for (const groupId of groupType.groups) {
    const group = await Group.findById(groupId);
    if (!group) continue;

    if (group.image && !!group.image.deleteHash) {
      const deleteResponse = await deleteImage(group.image.deleteHash);
      if (deleteResponse.error) {
        errors.addError(deleteResponse.error);
      }
    }

    await group.remove();
  }
};

module.exports = router;
