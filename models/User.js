const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  about: {
    type: String
  },
  currentGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group"
  },
  image: {
    link: {
      type: String
    },
    deleteHash: {
      type: String
    }
  },
  creationTimestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);
