const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const Filter = require("bad-words");
const filter = new Filter();

const runAPISafely = (coreFunction, res) => {
  try {
    coreFunction();
  } catch (err) {
    console.error(err.message); //DEV DEBUG ONLY
    const errors = new APIerrors();

    if (err.kind == "ObjectId") {
      return errors.addErrAndSendResponse(res, "Invalid Object ID");
    }

    return errors.addErrAndSendResponse(res, "Server error", "console", 500);
  }
};

const getTempUserToken = userId => {
  const payload = {
    user: {
      id: userId
    }
  };

  return jwt.sign(payload, process.env.jwtSecret || config.get("jwtSecret"), { expiresIn: 60 });
};

const signUserToken = (res, userId, isVerified) => {
  const errors = new APIerrors();
  const payload = {
    user: {
      id: userId
    }
  };

  jwt.sign(
    payload,
    process.env.jwtSecret || config.get("jwtSecret"),
    { expiresIn: 60 * 60 * 24 * 7 },
    (err, token) => {
      if (err) {
        return errors.addErrAndSendResponse(res, err, "console", 500);
      }
      res.json({ token, isVerified });
    }
  );
};

class APIerrors {
  constructor() {
    this.errors = [];
  }

  isNotEmpty() {
    return this.errors.length > 0;
  }

  addError(msg, param = "console", payload = null) {
    if (!msg && payload === null) return false;

    let error = { param, msg, payload };
    this.errors.push(error);

    return true;
  }

  sendErrorResponse(res, status = 400) {
    return res.status(status).json(this.errors);
  }

  addErrAndSendResponse(res, msg, param = "console", status = 400) {
    this.addError(msg, param);
    return this.sendErrorResponse(res, status);
  }

  addExpressValidationResult(req) {
    const errors = validationResult(req).array({ onlyFirstError: true });
    errors.forEach(error => {
      this.addError(error.msg, error.param);
    });

    if (this.isNotEmpty()) return true;

    return false;
  }
}

const validateRequest = APImethod => {
  switch (APImethod) {
    case "createGroup": {
      return [
        check("name", "Name is required")
          .exists({ checkFalsy: true })
          .isLength({ max: 256 })
          .withMessage("Name is too long")
          .custom(name => !filter.isProfane(name))
          .withMessage(
            "Name may contain profanity, please remove it to proceed"
          ),
        check("placeAddress", "Meeting place is required")
          .exists({ checkFalsy: true })
          .isLength({ max: 256 })
          .withMessage("Meeting place is too long")
          .custom((placeAddress, { req }) => {
            if (!!req.body.placeLat) return true;
            return !filter.isProfane(placeAddress);
          })
          .withMessage(
            "Meeting place may contain profanity, please remove it to proceed"
          ),
        check("time", "Meeting time is required").exists({ checkFalsy: true }),
        check("description", "Description is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(descr => !filter.isProfane(descr))
          .withMessage(
            "Description may contain profanity, please remove it to proceed"
          ),
        check("accessLevel", "Invalid access level option")
          .optional({ checkFalsy: true })
          .isIn(["Public", "Protected", "Private"]),
        check("maxSize", "Maximum size must be between 1 and 999")
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 999 })
      ];
    }
    case "updateGroup": {
      return [
        check("placeAddress", "Meeting place is required")
          .exists({ checkFalsy: true })
          .isLength({ max: 256 })
          .withMessage("Meeting place is too long")
          .custom((placeAddress, { req }) => {
            if (!!req.body.placeLat) return true;
            return !filter.isProfane(placeAddress);
          })
          .withMessage(
            "Meeting place may contain profanity, please remove it to proceed"
          ),
        check("description", "Description is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(descr => !filter.isProfane(descr))
          .withMessage(
            "Description may contain profanity, please remove it to proceed"
          ),
        check("accessLevel", "Invalid access level option")
          .optional({ checkFalsy: true })
          .isIn(["Public", "Protected", "Private"]),
        check("maxSize", "Maximum size must be between 1 and 999")
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 999 })
      ];
    }
    case "addNotice": {
      return [
        check("body", "Notice body is required")
          .exists({ checkFalsy: true })
          .isLength({ max: 1024 })
          .withMessage("Notice body is too long")
          .custom(body => !filter.isProfane(body))
          .withMessage(
            "Notice body may contain profanity, please remove it to proceed"
          )
      ];
    }
    case "login": {
      return [
        check("email", "Email address is invalid")
          .exists({ checkFalsy: true })
          .isEmail()
          .normalizeEmail(),
        check("password", "Password must be between 6 and 32 ASCII characters")
          .exists({ checkFalsy: true })
          .isAscii()
          .isLength({
            min: 6,
            max: 32
          })
      ];
    }
    case "requestGroupType": {
      return [
        check("name", "Name is required")
          .exists({ checkFalsy: true })
          .matches(/^[a-z0-9 ]+$/i)
          .withMessage("Name may only include numbers, letters, and spaces")
          .isLength({ max: 256 })
          .withMessage("Name is too long")
          .custom(name => !filter.isProfane(name))
          .withMessage(
            "Name may contain profanity, please remove it to proceed"
          ),
        check("description", "Description is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(descr => !filter.isProfane(descr))
          .withMessage(
            "Description may contain profanity, please remove it to proceed"
          ),
        check("category", "Invalid category")
          .exists({ checkFalsy: true })
          .isIn([
            "Social",
            "Gaming",
            "Educational",
            "Professional",
            "Hobby",
            "Other"
          ])
      ];
    }
    case "updateGroupType": {
      return [
        check("description", "Description is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(descr => !filter.isProfane(descr))
          .withMessage(
            "Description may contain profanity, please remove it to proceed"
          ),
        check("category", "Invalid category")
          .optional({ checkFalsy: true })
          .isIn([
            "Social",
            "Gaming",
            "Educational",
            "Professional",
            "Hobby",
            "Other"
          ])
      ];
    }
    case "createUser": {
      return [
        check("name", "Name is required")
          .exists({ checkFalsy: true })
          .isLength({ max: 64 })
          .withMessage("Name is too long")
          .custom(name => !filter.isProfane(name))
          .withMessage(
            "Name may contain profanity, please remove it to proceed"
          ),
        check("email", "Email address is invalid")
          .exists({ checkFalsy: true })
          .isEmail()
          .normalizeEmail(),
        check("password", "Password must be between 6 and 32 ASCII characters")
          .exists({ checkFalsy: true })
          .isAscii()
          .isLength({
            min: 6,
            max: 32
          }),
        check("about", "About field is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(about => !filter.isProfane(about))
          .withMessage(
            "About may contain profanity, please remove it to proceed"
          ),
        check("currentLocationAddress", "Current location is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 256 })
          .custom((currentLocationAddress, { req }) => {
            if (!!req.body.currentLocationLat) return true;
            return !filter.isProfane(currentLocationAddress);
          })
          .withMessage(
            "Current location may contain profanity, please remove it to proceed"
          )
      ];
    }
    case "resetPassword": {
      return [
        check("email", "Email address is invalid")
          .exists({ checkFalsy: true })
          .isEmail()
          .normalizeEmail(),
        check(
          "newPassword",
          "Password must be between 6 and 32 ASCII characters"
        )
          .exists({ checkFalsy: true })
          .isAscii()
          .isLength({
            min: 6,
            max: 32
          }),
        check("confirmNewPassword", "Passwords do not match")
          .exists({ checkFalsy: true })
          .custom((confirmNewPassword, { req }) => {
            return confirmNewPassword === req.body.newPassword;
          })
      ];
    }
    case "normalizeEmail": {
      return [
        check("email", "Email address is invalid")
          .exists({ checkFalsy: true })
          .isEmail()
          .normalizeEmail()
      ];
    }
    case "updateUser": {
      return [
        check("name", "Name is required")
          .not()
          .isEmpty({ ignore_whitespace: true })
          .isLength({ max: 64 })
          .withMessage("Name is too long")
          .custom(name => !filter.isProfane(name))
          .withMessage(
            "Name may contain profanity, please remove it to proceed"
          ),
        check("about", "About field is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 512 })
          .custom(about => !filter.isProfane(about))
          .withMessage(
            "About may contain profanity, please remove it to proceed"
          ),
        check("currentLocationAddress", "Current location is too long")
          .optional({ checkFalsy: true })
          .isLength({ max: 256 })
          .custom((currentLocationAddress, { req }) => {
            if (!!req.body.currentLocationLat) return true;
            return !filter.isProfane(currentLocationAddress);
          })
          .withMessage(
            "Current location may contain profanity, please remove it to proceed"
          )
      ];
    }
  }
};

module.exports = {
  runAPISafely,
  signUserToken,
  getTempUserToken,
  APIerrors,
  validateRequest
};
