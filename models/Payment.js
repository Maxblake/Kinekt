const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  payingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  amountPaid: {
    type: Number,
    required: true
  },
  currencyUsed: {
    type: String,
    required: true
  },
  groupLocksPurchased: {
    type: Number,
    required: true
  },
  groupLocksReceived: {
    type: Number,
    required: true
  },
  userTotalGroupLocks: {
    type: Number,
    required: true
  },
  creationTimestamp: {
    type: Date,
    default: Date.now
  },
  stripeResponse: {
    type: String,
    required: true
  }
});

module.exports = Payment = mongoose.model("payment", PaymentSchema);
