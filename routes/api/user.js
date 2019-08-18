const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const {
  runAPISafely,
  signUserToken,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const User = require("../../models/User");

// @route   POST api/user
// @desc    Register user
// @access  Public
router.post("/", validateRequest("createUser"), async (req, res) => {
  const errors = new APIerrors();

  if (errors.addExpressValidationResult(req))
    return errors.sendErrorResponse(res);

  runAPISafely(async () => {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return errors.addErrAndSendResponse(res, "User already exists", "email");
    }

    const userFields = buildUserFields(req, false);
    user = new User(userFields);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    signUserToken(res, user.id);
  });
});

// @route   PUT api/user
// @desc    Update a user
// @access  Private
router.put("/", [auth, validateRequest("updateUser")], async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    if (!User.findById(req.user.id)) {
      return errors.addErrAndSendResponse(res, "Invalid User ID");
    }

    const userFields = buildUserFields(req, true);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select("-password");

    return res.json(user);
  });
});

const buildUserFields = (req, updating = false) => {
  const { name, email, about } = req.body;
  let userFields = {};

  if (!updating && email) userFields.email = email;
  if (name) userFields.name = name;
  if (about) userFields.about = about;

  return userFields;
};

// @route   DELETE api/user
// @desc    Delete a user
// @access  Private
router.delete("/", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    if (!(await User.findOneAndDelete({ _id: req.user.id }))) {
      return errors.addErrAndSendResponse(res, "Invalid User ID");
    }

    res.status(200).json({ msg: "User deleted" });
  });
});

module.exports = router;
