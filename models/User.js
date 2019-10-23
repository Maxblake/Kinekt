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
    name: { type: String },
    HRID: { type: String }
  },
  currentLocation: {
    address: { type: String },
    lat: { type: String },
    lng: { type: String }
  },
  image: {
    link: {
      type: String
    },
    deleteHash: {
      type: String
    }
  },
  groupLocks: {
    type: Number,
    default: 0,
    required: true
  },
  referralCode: {
    type: String
  },
  selectedTheme: {
    type: String
  },
  creationTimestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);
