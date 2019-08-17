const { validationResult } = require("express-validator");
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

//TODO handle error better, maybe use constant for expiration time
const signUserToken = (res, userId) => {
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
      if (err) throw err;
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

module.exports = { runAPISafely, signUserToken, APIerrors };
