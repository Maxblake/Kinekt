const mongoose = require("mongoose");

const GroupTypeSchema = new mongoose.Schema({
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "group"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nameLower: {
    type: String
  },
  category: {
    type: String,
    required: true
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
  }
});

GroupTypeSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

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
