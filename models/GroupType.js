const mongoose = require("mongoose");

const GroupTypeSchema = new mongoose.Schema({
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "group"
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

GroupTypeSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

module.exports = Group = mongoose.model("groupType", GroupTypeSchema);
