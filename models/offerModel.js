const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      require: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      }, // 1 day from creation
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
