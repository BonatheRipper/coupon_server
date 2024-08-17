// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  price: { type: Number, unique: true, required: true },
  expiryDate: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model("Coupon", couponSchema);
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
