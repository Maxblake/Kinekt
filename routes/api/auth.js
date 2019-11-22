const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const stripe = require("stripe")(config.get("stripeSecret"));
const bcrypt = require("bcryptjs");
const nanoid = require("nanoid");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
sgMail.setApiKey(config.get("sgMailKey"));

const {
  runAPISafely,
  signUserToken,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const User = require("../../models/User");
const Payment = require("../../models/Payment");
const VerificationToken = require("../../models/VerificationToken");
const ResetToken = require("../../models/ResetToken");

// @route   GET api/auth/:checkIfAdmin
// @desc    Given JSON Web Token, return user object
// @access  Private
router.get("/:checkIfAdmin", auth, (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const user = await User.findById(req.user.id)
      .select("-password -email -creationTimestamp")
      .lean();

    if (!user) {
      return errors.addErrAndSendResponse(res, "Invalid User ID");
    }

    if (!user.isVerified) return res.json({ user: { isVerified: false } });

    const authResponse = { user };

    if (req.params.checkIfAdmin === "true") {
      let admins = config.get("admins");
      authResponse.isAdmin = admins.includes(req.user.id);
    }

    res.json(authResponse);
  }, res);
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
      return errors.addErrAndSendResponse(
        res,
        "Your email or password is invalid",
        "alert"
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errors.addErrAndSendResponse(
        res,
        "Your email or password is invalid",
        "alert"
      );
    }

    signUserToken(res, user.id, user.isVerified);
  }, res);
});

// @route   GET api/auth/sendEmailConfirmation
// @desc    Send a new user email confirmation to verify his/her account
// @access  Private
router.post("/sendEmailConfirmation", auth, (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const user = await User.findById(req.user.id)
      .select("email isVerified")
      .lean();

    if (!user) {
      return errors.addErrAndSendResponse(res, "Invalid User ID");
    }

    if (user.isVerified) {
      return errors.addErrAndSendResponse(
        res,
        "You're already verified, go forth and get stacking!",
        "alert-warning"
      );
    }

    await VerificationToken.deleteMany({ verifyingUser: user._id });

    const token = await assignUniqueToken(
      VerificationToken,
      user._id.toString()
    );
    const verificationToken = new VerificationToken({
      verifyingUser: user._id,
      token
    });

    await verificationToken.save();
    const isEmailSent = await sendEmailConfirmation(user.email, token);

    if (!isEmailSent) {
      return errors.addErrAndSendResponse(
        res,
        "Our messenger falcon couldn't find you, did you sign up with a valid email?",
        "alert"
      );
    }

    return res.sendStatus(200);
  }, res);
});

const sendEmailConfirmation = async (email, token) => {
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://happenstack.com"
      : "http://localhost:3000";

  const msg = {
    to: email,
    from: "HappenStack@happenstack.com",
    templateId: "d-bbb110aa3d9048129d94aa9f65699f6c",
    dynamic_template_data: {
      verifyURL: `${domain}/login/${token}`
    }
  };
  await sgMail.send(msg);
  return true;
};

const assignUniqueToken = async (model, userId) => {
  let i = 0;
  let uniqueTokenFound = false;
  let token = "";

  while (i < 50 && !uniqueTokenFound) {
    token = nanoid();
    if (await model.findOne({ token })) {
      i += 1;
      continue;
    }
    uniqueTokenFound = true;
  }

  if (!uniqueTokenFound) {
    token = userId;
  }

  return token;
};

// @route   GET api/auth/verifyUser
// @desc    Called when a user clicks the link sent to them for account verification via email
// @access  Private
router.post("/verifyUser/:token", (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const JSWT = req.body.JSWT ? req.body.JSWT : "yolo";
    const decoded = jwt.verify(JSWT, config.get("jwtSecret"));
    req.user = decoded.user;

    const user = await User.findById(req.user.id).select(
      "-password -email -creationTimestamp"
    );

    if (!user) {
      return errors.addErrAndSendResponse(
        res,
        "You must be logged in to confirm your account",
        "alert-warning"
      );
    }

    if (user.isVerified) {
      return errors.addErrAndSendResponse(
        res,
        "You're already verified, go forth and get stacking!",
        "alert-warning"
      );
    }

    const token = await VerificationToken.findOne({ token: req.params.token });
    if (!token) {
      return errors.addErrAndSendResponse(
        res,
        "Your confirmation token has expired, please click the resend button from the login page and try again",
        "alert-warning"
      );
    }

    if (!user._id.equals(token.verifyingUser)) {
      return errors.addErrAndSendResponse(
        res,
        "Your confirmation token appears to be invalid, please click the resend button from the login page and try again",
        "alert-warning"
      );
    }

    user.isVerified = true;
    await Promise.all([user.save(), token.remove()]);

    return res.json({ user });
  }, res);
});

// @route   GET api/auth/sendResetInstructions
// @desc    Send a user an email with a link to reset his/her password
// @access  Public
router.post(
  "/sendResetInstructions",
  validateRequest("normalizeEmail"),
  (req, res) => {
    const errors = new APIerrors();
    errors.addExpressValidationResult(req);

    runAPISafely(async () => {
      const user = await User.findOne({ email: req.body.email })
        .select("email")
        .lean();

      if (!user) {
        return res.sendStatus(200);
      }

      await ResetToken.deleteMany({ resettingUser: user._id });

      const token = await assignUniqueToken(ResetToken, user._id.toString());
      const resetToken = new ResetToken({
        resettingUser: user._id,
        token
      });

      await resetToken.save();
      await sendResetInstructions(user.email, token);

      return res.sendStatus(200);
    }, res);
  }
);

const sendResetInstructions = async (email, token) => {
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://happenstack.com"
      : "http://localhost:3000";

  const msg = {
    to: email,
    from: "HappenStack@happenstack.com",
    templateId: "d-a2502111a9e0460f9079fb6c0ce2d137",
    dynamic_template_data: {
      resetURL: `${domain}/reset-password/${token}`
    }
  };
  await sgMail.send(msg);
  return true;
};

// @route   GET api/auth/verifyUser
// @desc    Called when a user clicks the link sent to them for password reset via email, then follows the prompt on the password reset page
// @access  Public
router.post(
  "/resetPassword/:token",
  validateRequest("resetPassword"),
  (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return errors.addErrAndSendResponse(
          res,
          "Provided email does not match primary email on the account",
          "email"
        );
      }

      const token = await ResetToken.findOne({ token: req.params.token });
      if (!token) {
        return errors.addErrAndSendResponse(
          res,
          "Your password reset token has expired, please follow the password reset prompt from the login page and try again",
          "alert-warning"
        );
      }

      if (!user._id.equals(token.resettingUser)) {
        return errors.addErrAndSendResponse(
          res,
          "Provided email does not match primary email on the account",
          "email"
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);

      await Promise.all([user.save(), token.remove()]);

      return res.sendStatus(200);
    }, res);
  }
);

router.post("/enterBeta", (req, res) => {
  runAPISafely(async () => {
    const { entryToken } = req.body;

    if (entryToken === "AARRRRRP") {
      return res.status(200).json({ entryToken: "KJYA6yuNClsfFdAHTiHC" });
    }

    return res.sendStatus(400);
  }, res);
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
        onChargeSuccess({ ...opts, userId: req.user.id, charge }, res);
      })
      .catch(err => console.log(err));
  }, res);
});

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

//TODO Make sure this never errors out
const onChargeSuccess = async (opts, res) => {
  try {
    const { referralCode, userId, charge } = opts;
    const groupLocks = Number(opts.groupLocks);

    const user = await User.findById(userId).select(
      "-password -creationTimestamp"
    );

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
    const payment = await logPayment(user, groupLocks, referredUser, charge);
    res.status(200).json({ groupLocks: user.groupLocks, payment });
  } catch (err) {
    console.error(err.message); //DEV DEBUG ONLY
    res.sendStatus(400);
  }
};

const logPayment = async (user, groupLocks, referredUser, charge) => {
  const paymentfields = {
    payingUser: user._id,
    amountPaid: charge.amount,
    currencyUsed: charge.currency,
    groupLocksPurchased: groupLocks,
    groupLocksReceived: !!referredUser
      ? groupLocks + getNumExtraLocksWithReferral(groupLocks)
      : groupLocks,
    userTotalGroupLocks: user.groupLocks,
    stripeResponse: JSON.stringify(charge)
  };
  if (!!referredUser) paymentfields.referredUser = referredUser._id;

  const payment = new Payment(paymentfields);
  await payment.save();
  await sendPaymentReceipt(
    user.email,
    groupLocks,
    `${(charge.amount / 100).toFixed(2)} ${charge.currency.toUpperCase()}`
  );
  return payment;
};

const sendPaymentReceipt = async (email, groupLocks, payment) => {
  const msg = {
    to: email,
    from: "HappenStack@happenstack.com",
    templateId: "d-2b4c058eef7b4273bfabb1e8d73203ee",
    dynamic_template_data: {
      groupLocks,
      payment
    }
  };
  await sgMail.send(msg);
};

module.exports = router;
