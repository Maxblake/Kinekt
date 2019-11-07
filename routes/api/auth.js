const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const stripe = require("stripe")(config.get("stripeSecret"));
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const {
  runAPISafely,
  signUserToken,
  APIerrors,
  validateRequest
} = require("./helpers/helpers");

const User = require("../../models/User");
const Payment = require("../../models/Payment");
const VerificationToken = require("../../models/VerificationToken");

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

    signUserToken(res, user.id, user.isVerified);
  });
});

// @route   GET api/auth/sendEmailConfirmation
// @desc    Send a new user email confirmation to verify his/her account
// @access  Private
router.post("/sendEmailConfirmation", auth, (req, res) => {
  console.log("here");
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
        "alert"
      );
    }

    await VerificationToken.deleteMany({ verifyingUser: user._id });

    const token = await assignUniqueToken(user._id.toString());
    const verificationToken = new VerificationToken({
      verifyingUser: user._id,
      token
    });

    await verificationToken.save();
    const isEmailSent = await sendEmailConfirmation(user.email, token);

    if (!isEmailSent) {
      return errors.addErrAndSendResponse(
        res,
        "Our email messenger falcon couldn't find you, did you sign up with a valid email?",
        "alert"
      );
    }

    return res.sendStatus(200);
  });
});

const sendEmailConfirmation = async email => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "happenstackhelp@gmail.com",
      pass: config.get("emailPW")
    }
  });

  const mailOptions = {
    from: "happenstackhelp@gmail.com",
    to: email,
    subject: "Confirm your HappenStack account",
    text:
      "Hey friend,\n\n" +
      "Please verify your HappenStack account by clicking this link: \nhttp://localhost:3000/login/" +
      token +
      ".\n"
  };
};

const assignUniqueToken = async userId => {
  let i = 0;
  let uniqueTokenFound = false;
  let token = "";

  while (i < 50 && !uniqueTokenFound) {
    token = shortid.generate();
    if (await VerificationToken.findOne({ token })) {
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

router.post("/enterBeta", (req, res) => {
  runAPISafely(async () => {
    const { entryToken } = req.body;

    if (entryToken === "AARRRRRP") {
      return res.status(200).json({ entryToken: "KJYA6yuNClsfFdAHTiHC" });
    }

    return res.sendStatus(400);
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
        onChargeSuccess({ ...opts, userId: req.user.id, charge }, res);
      })
      .catch(err => console.log(err));
  });
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

const onChargeSuccess = async (opts, res) => {
  try {
    const { referralCode, userId, charge } = opts;
    const groupLocks = Number(opts.groupLocks);

    const user = await User.findById(userId).select(
      "-password -email -creationTimestamp"
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

    const payment = await logPayment(user, groupLocks, referredUser, charge);
    await user.save();
    res.status(200).json({ user, payment });
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
  //TODO email user a receipt
  return payment;
};

module.exports = router;
