const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const { runAPISafely, signUserToken } = require("./helpers/helpers");

const User = require("../../models/User");

// @route   GET api/auth/:checkIfAdmin
// @desc    Given JSON Web Token, return user object
// @access  Public
router.get("/:checkIfAdmin", auth, (req, res) => {
  runAPISafely(async () => {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    const authResponse = { user };

    if (req.params.checkIfAdmin === "true") {
      let admins = config.get("admins");
      authResponse.isAdmin = admins.includes(req.user.id);
    }

    res.json(authResponse);
  });
});

// @route   POST api/auth
// @desc    Authenticate user & get token, AKA Login
// @access  Public
router.post(
  "/",
  [
    check("email", "Email address is invalid").isEmail(),
    check("password", "Password is required").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    runAPISafely(async () => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ param: "alert", msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ param: "alert", msg: "Invalid Credentials" }] });
      }

      signUserToken(res, user.id);
    });
  }
);

module.exports = router;
