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
    address: { type: String, required: true },
    lat: { type: String },
    lng: { type: String }
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
  bannedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  description: {
    type: String
  },
  time: {
    type: Date
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

GroupSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

module.exports = Group = mongoose.model("group", GroupSchema);
