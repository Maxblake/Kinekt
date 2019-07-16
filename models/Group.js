const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user"
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user"
  },
  groupType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  meetingPlace: {
    type: String,
    required: true
  },
  imageURL: {
    type: String
  },
  meetingTimeContext: {
    type: String,
    required: true
  },
  // new Date(Date.now()).toISOString()
  meetingTime: {
    type: Date
  },
  minSize: {
    type: Number
  },
  maxSize: {
    type: Number
  },
  notifications: [
    {
      author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true
        },
        name: {
          type: String,
          required: true
        }
      },
      body: {
        type: String,
        required: true
      },
      likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user"
      }
    }
  ]
});

module.exports = Group = mongoose.model("group", GroupSchema);
