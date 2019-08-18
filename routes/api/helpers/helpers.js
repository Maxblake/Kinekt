const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const runAPISafely = coreFunction => {
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

const signUserToken = (res, userId) => {
  const errors = new APIerrors();
  const payload = {
    user: {
      id: userId
    }
  };

  jwt.sign(
    payload,
    config.get("jwtSecret"),
    { expiresIn: 3600000 },
    (err, token) => {
      if (err) {
        return errors.addErrAndSendResponse(res, err, "console", 500);
      }
      res.json({ token });
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

  addError(msg, param = "console") {
    if (!msg) return false;

    let error = { param, msg };
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
    const errors = validationResult(req).array();
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
        check(
          "name",
          "Name is required, and must consist of alphanumeric characters"
        )
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
        check(
          "place",
          "Meeting place is required, and must consist of alphanumeric characters"
        )
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Meeting place is too long"),
        check("time", "Meeting time is required").exists({ checkFalsy: true }),
        check("description", "Description is too long")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 }),
        check("accessLevel", "Invalid access level option")
          .optional()
          .isIn(["Public", "Private"]),
        check("minSize", "Minimum size must be between 1 and 999")
          .optional()
          .isInt()
          .isLength({ min: 0, max: 999 })
          .custom((value, { req }) =>
            req.body.maxSize ? value < req.body.maxSize : true
          )
          .withMessage("Minimum size must be lesser than maximum size"),
        check("maxSize", "Maximum size must be between 1 and 999")
          .optional()
          .isInt()
          .isLength({ min: 0, max: 999 })
          .custom((value, { req }) =>
            req.body.minSize ? value > req.body.minSize : true
          )
          .withMessage("Maximum size must be greater than minimum size")
      ];
    }
    case "updateGroup": {
      return [
        check("name", "Name must consist of alphanumeric characters")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
        check("place", "Meeting place must consist of alphanumeric characters")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Meeting place is too long"),
        check("description", "Description is too long")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 }),
        check("accessLevel", "Invalid access level option")
          .optional()
          .isIn(["Public", "Private"]),
        check("minSize", "Minimum size must be between 1 and 999")
          .optional()
          .isInt()
          .isLength({ min: 0, max: 999 })
          .custom((value, { req }) =>
            req.body.maxSize ? value < req.body.maxSize : true
          )
          .withMessage("Minimum size must be lesser than maximum size"),
        check("maxSize", "Maximum size must be between 1 and 999")
          .optional()
          .isInt()
          .isLength({ min: 0, max: 999 })
          .custom((value, { req }) =>
            req.body.minSize ? value > req.body.minSize : true
          )
          .withMessage("Maximum size must be greater than minimum size")
      ];
    }
    case "addNotification": {
      return [
        check(
          "body",
          "Notification body is required, and must consist of alphanumeric characters"
        )
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ max: 1024 })
          .withMessage("Notification body is too long")
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
        check(
          "name",
          "Name is required, and must consist of alphanumeric characters"
        )
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
        check("description", "Description is too long")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 }),
        check("category", "Invalid category")
          .exists({ checkFalsy: true })
          .isIn([
            "Social",
            "Gaming",
            "Educational",
            "Professional",
            "Hobby",
            "Private",
            "Other"
          ])
      ];
    }
    case "updateGroupType": {
      return [
        check("name", "Name must consist of alphanumeric characters")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
        check("description", "Description is too long")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 }),
        check("category", "Invalid category")
          .optional()
          .isIn([
            "Social",
            "Gaming",
            "Educational",
            "Professional",
            "Hobby",
            "Private",
            "Other"
          ])
      ];
    }
    case "createUser": {
      return [
        check(
          "name",
          "Name is required, and must consist of alphanumeric characters"
        )
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
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
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 })
      ];
    }
    case "updateUser": {
      return [
        check("name", "Name must consist of alphanumeric characters")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 256 })
          .withMessage("Name is too long"),
        check("about", "About field is too long")
          .optional()
          .isAlphanumeric()
          .isLength({ max: 512 })
      ];
    }
  }
};

module.exports = { runAPISafely, signUserToken, APIerrors, validateRequest };
