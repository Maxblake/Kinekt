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
  description: {
    type: String
  }
});

module.exports = Group = mongoose.model("groupType", GroupTypeSchema);
