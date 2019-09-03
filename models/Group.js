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
  users: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      memberType: {
        type: String
      }
    }
  ],
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
  ],
  creationTimestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = Group = mongoose.model("group", GroupSchema);
