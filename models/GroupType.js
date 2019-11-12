const mongoose = require("mongoose");

const GroupTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "group"
  },
  category: {
    type: String,
    required: true
  },
  nameLower: {
    type: String
  },
  description: {
    type: String
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

GroupTypeSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

GroupTypeSchema.index({ name: 1 });

GroupTypeSchema.pre("save", function(next) {
  this.nameLower = this.name.toLowerCase();
  next();
});

const GroupType = mongoose.model("groupType", GroupTypeSchema);
const RequestedGroupType = mongoose.model(
  "requestedGroupType",
  GroupTypeSchema
);

module.exports = { GroupType, RequestedGroupType };
