const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  HRID: {
    type: String,
    required: true
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "groupType",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  place: {
    type: String,
    required: true
  },
  image: {
    link: {
      type: String
    },
    deleteHash: {
      type: String
    }
  },
  accessLevel: {
    type: String,
    required: true
  },
  // new Date(Date.now()).toISOString()
  time: {
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
