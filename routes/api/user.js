const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const shortid = require("shortid");
const upload = multer({ storage: multer.memoryStorage() });
const { updateImage, uploadImage, deleteImage } = require("./external/imgur");
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
router.post(
  "/",
  [upload.single("image"), validateRequest("createUser")],
  async (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return errors.addErrAndSendResponse(
          res,
          "User already exists",
          "email"
        );
      }

      const userFields = buildUserFields(req, false);
      user = new User(userFields);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      await assignUniqueRefCode(user, errors);
      await handleImageUpload(user, req, errors, false);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await user.save();

      signUserToken(res, user.id, false);
    }, res);
  }
);

const assignUniqueRefCode = async (user, errors) => {
  let i = 0;
  let uniqueRefCodeFound = false;
  let referralCode = "";

  while (i < 50 && !uniqueRefCodeFound) {
    referralCode = shortid.generate();
    if (await User.findOne({ referralCode })) {
      i += 1;
      continue;
    }
    uniqueRefCodeFound = true;
  }

  if (!uniqueRefCodeFound) {
    errors.addError("Unable to generate unique referral code");
  }

  user.referralCode = referralCode;
};

// @route   PUT api/user
// @desc    Update a user
// @access  Private
router.put(
  "/",
  [upload.single("image"), auth, validateRequest("updateUser")],
  async (req, res) => {
    const errors = new APIerrors();

    if (errors.addExpressValidationResult(req))
      return errors.sendErrorResponse(res);

    runAPISafely(async () => {
      if (!User.findById(req.user.id)) {
        return errors.addErrAndSendResponse(res, "Invalid User ID");
      }

      const userFields = buildUserFields(req, true);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      ).select("-password -email -creationTimestamp");

      if (!user) {
        return errors.addErrAndSendResponse(res, "Unable to find user");
      }

      await handleImageUpload(user, req, errors, true);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await user.save();

      return res.json(user);
    }),
      res;
  }
);

const buildUserFields = (req, updating = false) => {
  const {
    name,
    email,
    about,
    selectedTheme,
    currentLocationAddress,
    currentLocationLat,
    currentLocationLng
  } = req.body;
  let userFields = {};

  if (!updating) userFields.groupLocks = 8;
  if (!updating && email) userFields.email = email;
  if (name) userFields.name = name;
  if (about) userFields.about = about;
  if (selectedTheme) userFields.selectedTheme = selectedTheme;
  userFields.currentLocation = {
    address: currentLocationAddress,
    lat: currentLocationLat,
    lng: currentLocationLng
  };

  return userFields;
};

const handleImageUpload = async (user, req, errors, updating = false) => {
  if (req.file) {
    let uploadResponse = {};

    if (updating && user.image && !!user.image.deleteHash) {
      const updateImageResponse = await updateImage(
        req.file,
        user.image.deleteHash,
        343,
        343
      );
      uploadResponse = updateImageResponse.uploadResponse;
    } else {
      uploadResponse = await uploadImage(req.file, 343, 343);
    }

    if (uploadResponse.error) {
      errors.addError(
        `Unable to ${
          updating ? "update" : "create"
        } user: Image upload failed with error [${uploadResponse.error}]`
      );
    } else {
      user.image = uploadResponse;
    }
  } else if (
    req.body.image === "REMOVE" &&
    updating &&
    user.image &&
    !!user.image.deleteHash
  ) {
    const deleteResponse = await deleteImage(user.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    } else {
      user.image = undefined;
    }
  }
};

// @route   DELETE api/user
// @desc    Delete a user
// @access  Private
router.delete("/", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const user = await User.findById(req.user.id);

    if (!user) {
      errors.addError("Invalid user ID");
    }

    await handleUserDeletionSideEffects(user, errors);

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    await user.remove();

    res.status(200).json({ msg: "User account deleted" });
  }, res);
});

const handleUserDeletionSideEffects = async (user, errors) => {
  if (user.image && !!user.image.deleteHash) {
    const deleteResponse = await deleteImage(user.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    }
  }
};

// @route   PUT api/user/is-rc-valid
// @desc    Check if a referral code is valid
// @access  Private
router.put("/is-rc-valid", auth, async (req, res) => {
  const errors = new APIerrors();

  runAPISafely(async () => {
    const { referralCode } = req.body;
    const user = await User.findOne({ referralCode });

    if (!user) {
      errors.addError("Invalid referral code", "referralCode");
    }

    if (user && user._id.equals(req.user.id)) {
      errors.addError("Referring yourself won't work", "referralCode");
    }

    if (errors.isNotEmpty()) {
      return errors.sendErrorResponse(res);
    }

    res.status(200).json({ msg: "Referral code is valid" });
  }, res);
});

module.exports = router;
