const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const multer = require("multer");
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

      await handleImageUpload(user, req, errors, false);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await user.save();

      signUserToken(res, user.id);
    });
  }
);

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
      ).select("-password");

      if (!user) {
        return errors.addErrAndSendResponse(res, "Unable to find user");
      }

      await handleImageUpload(user, req, errors, true);

      if (errors.isNotEmpty()) {
        return errors.sendErrorResponse(res);
      }

      await user.save();

      return res.json(user);
    });
  }
);

const buildUserFields = (req, updating = false) => {
  const {
    name,
    email,
    about,
    currentLocationAddress,
    currentLocationLat,
    currentLocationLng
  } = req.body;
  let userFields = {};

  if (!updating && email) userFields.email = email;
  if (name) userFields.name = name;
  if (about) userFields.about = about;
  if (currentLocationAddress || currentLocationLat)
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
        user.image.deleteHash
      );
      uploadResponse = updateImageResponse.uploadResponse;
    } else {
      uploadResponse = await uploadImage(req.file);
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
  });
});

const handleUserDeletionSideEffects = async (user, errors) => {
  if (user.image && !!user.image.deleteHash) {
    const deleteResponse = await deleteImage(user.image.deleteHash);
    if (deleteResponse.error) {
      errors.addError(deleteResponse.error);
    }
  }
};

module.exports = router;
