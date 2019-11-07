const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
  verifyingUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  token: { type: String, required: true },
  creationTimestamp: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200
  }
});

VerificationTokenSchema.index({ verifyingUser: 1 });

module.exports = VerificationToken = mongoose.model(
  "verificationToken",
  VerificationTokenSchema
);
