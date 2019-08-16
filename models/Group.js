const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  HRID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  groupType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groupType",
    required: true
  },
  accessLevel: {
    type: String,
    required: true
  },
  place: {
    type: String,
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
  description: {
    type: String
  },
  time: {
    type: Date
  },
  minSize: {
    type: Number
  },
  maxSize: {
    type: Number
  },
  image: {
    link: {
      type: String
    },
    deleteHash: {
      type: String
    }
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
