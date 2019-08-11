const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const multer = require("multer");

const Group = require("../../models/Group");
const { GroupType, RequestedGroupType } = require("../../models/GroupType");

// @route   GET api/admin/get-requested-group-types
// @desc    Get a list of requested group types
// @access  Private
router.get("/get-requested-group-types", auth, async (req, res) => {
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

// @route   POST api/admin/process-requested-group-types
// @desc    Given a list of accepted and rejected 'requested group types', transfer accepted group types to the 'group type' model and remove all listed group types from the 'requested group type' model
// @access  Private
router.post("/process-requested-group-types", auth, async (req, res) => {
  const { groupTypeDecisions } = req.body;

  try {
    requestedGroupTypes = await RequestedGroupType.find({
      _id: { $in: Object.keys(groupTypeDecisions) }
    });

    for (const requestedGroupType of requestedGroupTypes) {
      if (groupTypeDecisions[requestedGroupType._id] === "Accept") {
        let groupType = new GroupType(requestedGroupType.toObject());
        await groupType.save();
      }
      await requestedGroupType.remove();
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
