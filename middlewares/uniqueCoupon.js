// middlewares/uniqueCoupon.js
const Coupon = require("../models/coupon");

const checkUniqueCoupon = async (req, res, next) => {
  const { code } = req.body;
  const existingCoupon = await Coupon.findOne({ code });

  if (existingCoupon) {
    return res.status(400).json({ error: "Coupon code already exists." });
  }

  next();
};

module.exports = checkUniqueCoupon;
