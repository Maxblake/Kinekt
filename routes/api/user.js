const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   POST api/user
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password must be between 6 and 32 characters").isLength({
      min: 6,
      max: 32
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, about } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ param: "email", msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        about: about === undefined ? "" : about
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      // TODO change expire to 1 hour
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/user
// @desc    Update a user
// @access  Private
//TODO change all updating routes to put, not post
router.put("/", auth, async (req, res) => {
  const { name, about } = req.body;

  if (!User.findById(req.user.id)) {
    return res.status(400).json({
      msg: "Invalid User ID"
    });
  }

  // build group type object
  const userFields = {};

  if (name) userFields.name = name;
  if (about) userFields.about = about;

  try {
    // update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/user
// @desc    Delete a user
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
