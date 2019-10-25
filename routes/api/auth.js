const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const stripe = require("stripe")(config.get("stripeSecret"));
const bcrypt = require("bcryptjs");
const {
  runAPISafely,
  signUserToken,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const User = require("../../models/User");

// @route   GET api/auth/:checkIfAdmin
// @desc    Given JSON Web Token, return user object
// @access  Private
router.get("/:checkIfAdmin", auth, (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    if (!user) {
      return errors.addErrAndSendResponse(res, "Invalid User ID");
    }

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
router.post("/", validateRequest("login"), (req, res) => {
  const errors = new APIerrors();

  if (errors.addExpressValidationResult(req))
    return errors.sendErrorResponse(res);

  runAPISafely(async () => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return errors.addErrAndSendResponse(res, "Invalid Credentials", "alert");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errors.addErrAndSendResponse(res, "Invalid Credentials", "alert");
    }

    signUserToken(res, user.id);
  });
});

router.post("/enterBeta", (req, res) => {
  runAPISafely(async () => {
    const { entryToken } = req.body;

    if (entryToken === "AARRRRRP") {
      return res.status(200).json({ entryToken: "KJYA6yuNClsfFdAHTiHC" });
    }

    return res.status(400);
  });
});

// @route   POST api/auth/post-stripe-payment
// @desc    Post a payment to stripe
// @access  Private
router.post("/post-stripe-payment", auth, (req, res) => {
  runAPISafely(async () => {
    const { charge, opts } = req.body;

    stripe.charges
      .create(charge)
      .then(async charge => {
        onChargeSuccess({ ...opts, userId: req.user.id }, res);
      })
      .catch(err => console.log(err));
  });
});

const onChargeSuccess = async (opts, res) => {
  const { referralCode, userId } = opts;
  const groupLocks = Number(opts.groupLocks);

  const getNumExtraLocksWithReferral = groupLocks => {
    switch (groupLocks) {
      case 3: {
        return 1;
      }
      case 8: {
        return 2;
      }
      case 21: {
        return 3;
      }
      case 55: {
        return 5;
      }
      default: {
        return groupLocks;
      }
    }
  };

  const user = await User.findById(userId).select("-password");

  const referredUser = await User.findOne({ referralCode });

  if (!!referredUser) {
    user.groupLocks =
      user.groupLocks + groupLocks + getNumExtraLocksWithReferral(groupLocks);
    referredUser.groupLocks =
      referredUser.groupLocks + getNumExtraLocksWithReferral(groupLocks);
    referredUser.save();
  } else {
    user.groupLocks = user.groupLocks + groupLocks;
  }

  await user.save();
  res.status(200).json({ user });
};

module.exports = router;
