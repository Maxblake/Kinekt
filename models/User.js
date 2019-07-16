const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  currentGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group"
  }
});

module.exports = User = mongoose.model("user", UserSchema);
