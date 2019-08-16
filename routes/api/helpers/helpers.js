const jwt = require("jsonwebtoken");
const config = require("config");

const runAPISafely = coreFunction => {
  try {
    coreFunction();
  } catch (err) {
    console.error(err.message); //DEV DEBUG ONLY

    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid Object ID" });
    }

    res.status(500).send("Server error");
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

module.exports = { runAPISafely, signUserToken };
