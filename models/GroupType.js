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

module.exports = Group = mongoose.model("groupType", GroupTypeSchema);
