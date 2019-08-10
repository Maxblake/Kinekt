const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage } = require("./external/imgur");

const Group = require("../../models/Group");
const { GroupType, RequestedGroupType } = require("../../models/GroupType");

// @route   GET api/admin/get-requested-group-types
// @desc    Get a list of group types ordered and filtered by passed criteria
// @access  Public
//TODO abstract user and group numbers in group type object
router.get("/get-requested-group-types", async (req, res) => {
  try {
    const requestedGroupTypes = await RequestedGroupType.find().select(
      "-groups"
    );

    res.json(requestedGroupTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/group-type/:id
// @desc    Get a group type's name, description, and pertaining list of groups
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const groupType = await GroupType.findById(req.params.id);
    res.json(groupType);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

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

module.exports = router;
