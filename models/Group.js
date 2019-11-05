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
  notices: [
    {
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
      },
      creationTimestamp: {
        type: Date,
        default: Date.now
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
  chat: [
    {
      body: {
        type: String,
        required: true
      },
      user: {
        name: {
          type: String
        },
        id: {
          type: String,
          required: true
        }
      },
      creationTimestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  creationTimestamp: {
    type: Date
  }
});

GroupSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

GroupSchema.index({ HRID: 1 });

module.exports = Group = mongoose.model("group", GroupSchema);
