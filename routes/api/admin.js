const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { runAPISafely } = require("./helpers/helpers");

const { GroupType, RequestedGroupType } = require("../../models/GroupType");

// @route   GET api/admin/get-requested-group-types
// @desc    Get a list of requested group types
// @access  Private
router.get("/get-requested-group-types", auth, (req, res) => {
  runAPISafely(async () => {
    const requestedGroupTypes = await RequestedGroupType.find().select(
      "-groups"
    );

    res.json(requestedGroupTypes);
  });
});

// @route   POST api/admin/process-requested-group-types
// @desc    Given a list of accepted and rejected 'requested group types', transfer accepted group types to the 'group type' model and remove all listed group types from the 'requested group type' model
// @access  Private
router.post("/process-requested-group-types", auth, (req, res) => {
  runAPISafely(async () => {
    const { groupTypeDecisions } = req.body;

    requestedGroupTypes = await RequestedGroupType.find({
      _id: { $in: Object.keys(groupTypeDecisions) }
    });

    for (const requestedGroupType of requestedGroupTypes) {
      if (groupTypeDecisions[requestedGroupType._id] === "Accept") {
        groupTypeFields = requestedGroupType.toObject();
        delete groupTypeFields._id;

        let groupType = new GroupType(groupTypeFields);
        groupType.save();
      }
      requestedGroupType.remove();
    }

    res.status(200).send("OK");
  });
});

module.exports = router;
