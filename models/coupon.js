const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  price: { type: Number, unique: true, required: true },
  expiryDate: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model is already compiled
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
