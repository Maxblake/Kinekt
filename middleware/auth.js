const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.jwtSecret || config.get("jwtSecret")
    );

    req.user = decoded.user;
    req.isAdmin = (process.env.admins || config.get("admins")).includes(
      decoded.user.id
    );
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
