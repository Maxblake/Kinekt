const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage } = require("./external/imgur");
const { runAPISafely } = require("./helpers/helpers");

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
// TODO fill in other required fields
router.post(
  "/request",
  [
    upload.single("image"),
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

    runAPISafely(async () => {
      const error = {};

      if (await GroupType.findOne({ nameLower: req.body.name.toLowerCase() })) {
        error.msg = "Unable to create group type: Name is unavailable";
      } else if (await RequestedGroupType.findOne({ creator: req.user.id })) {
        error.msg =
          "Unable to create group type: User already has pending request";
      } else {
        const groupTypeFields = buildGroupTypeFields(req);

        requestedGroupType = new RequestedGroupType(groupTypeFields);

        if (await handleImageUpload(requestedGroupType, req, error, false)) {
          await requestedGroupType.save();
          res.status(200).send("OK");
        }
      }

      if (!!error.msg) {
        return res.status(400).json(error);
      }
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

// @route   POST api/group-type/:id
// @desc    Update a group type
// @access  Private
router.post("/:id", async (req, res) => {
  runAPISafely(async () => {
    const groupTypeFields = buildGroupTypeFields(req, true);
    const error = {};

    const groupType = await GroupType.findByIdAndUpdate(
      req.params.id,
      { $set: groupTypeFields },
      { new: true }
    );

    if (!groupType) {
      error.msg = "Unable to find group type";
    } else if (await handleImageUpload(groupType, req, error, true)) {
      await groupType.save();

      return res.json(groupType);
    }

    if (!!error.msg) {
      return res.status(400).json(error);
    }
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

const handleImageUpload = async (groupType, req, error, updating = false) => {
  if (req.file) {
    let imageResponse = {};

    if (updating && groupType.image) {
      const updateImageResponse = await updateImage(
        req.file,
        groupType.image.deleteHash
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

    groupType.image = imageResponse;
  }
  return true;
};

// @route   DELETE api/group-type/:id
// @desc    Delete a group type
// @access  Private
// TODO make sure only creator or super admins can delete these
router.delete("/:id", auth, async (req, res) => {
  runAPISafely(async () => {
    if (!!(await GroupType.findByIdAndDelete(req.params.id))) {
      return res.json({ msg: "Group type deleted" });
    }
    res.status(400).json({ msg: "Unable to find group type" });
  });
});

module.exports = router;
