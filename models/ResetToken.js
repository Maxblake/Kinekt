const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
  resettingUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  token: { type: String, required: true },
  creationTimestamp: {
    type: Date,
    default: Date.now,
    required: true,
    expires: 43200
  }
});

ResetTokenSchema.index({ resettingUser: 1 });

module.exports = ResetToken = mongoose.model("resetToken", ResetTokenSchema);
