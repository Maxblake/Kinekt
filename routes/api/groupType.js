const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Group = require("../../models/Group");
const GroupType = require("../../models/GroupType");

// @route   POST api/group-type/list
// @desc    Get a list of group types ordered and filtered by passed criteria
// @access  Public
//TODO maybe don't return groups, abstract user and group numbers in group type object
router.post("/list", async (req, res) => {
  const { sortBy, category, searchTerms } = req.body;
  const query = {};

  if (category && category !== "All") query.category = category;
  if (searchTerms) {
    query.$text = { $search: searchTerms };
  }

  try {
    let groupTypes = await GroupType.find(query, {
      score: { $meta: "textScore" }
    })
      .select("-groups")
      .sort({
        score: { $meta: "textScore" }
      })
      .lean();

    if (searchTerms) {
      groupTypes = groupTypes.filter(groupType => {
        return groupType.score > 1;
      });
    }

    res.json(groupTypes);
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

    if (await GroupType.findOne({ name })) {
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
  const { name, description, category } = req.body;

  if (!GroupType.findById(req.params.id)) {
    return res.status(400).json({
      msg: "Invalid Group Type ID"
    });
  }

  // build group type object
  const groupTypeFields = {};

  if (name) groupTypeFields.name = name;
  if (description) groupTypeFields.description = description;
  if (category) groupTypeFields.category = category;

  try {
    // update
    const groupType = await GroupType.findByIdAndUpdate(
      req.params.id,
      { $set: groupTypeFields },
      { new: true }
    );

    return res.json(groupType);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/group-type/:id
// @desc    Delete a group type
// @access  Private
// TODO make sure only creator or super admins can delete these
router.delete("/:id", auth, async (req, res) => {
  try {
    await GroupType.findByIdAndDelete(req.params.id);
    res.json({ msg: "Group type deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
