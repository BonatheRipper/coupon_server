// routes/coupon.js
const express = require("express");
const router = express.Router();

const generateCouponCode = require("../utils/generateCoupon");
const checkUniqueCoupon = require("../middlewares/uniqueCoupon");
const Coupon = require("../models/Coupon");
// Generate Coupons
router.post("/generate", async (req, res) => {
  const { quantity, expiryDate, price, prefix } = req.body;
  const coupons = [];

  for (let i = 0; i < quantity; i++) {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = generateCouponCode(prefix);
      const existingCoupon = await Coupon.findOne({ code });
      if (!existingCoupon) isUnique = true;
    }

    const newCoupon = new Coupon({ code, expiryDate, price });

    await newCoupon.save();
    coupons.push(newCoupon);
  }
  const allCoupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    message: "Coupons generated successfully",
    data: allCoupons,
  });
});

// Delete Coupon
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Coupon.findByIdAndDelete(id);
  res.json({ message: "Coupon deleted successfully." });
});

// Use Coupon
router.post("/use", async (req, res) => {
  const couponCode = req.body.couponCode;
  // console.log(couponCode);
  try {
    const couponExist = await Coupon.findOne({ code: couponCode });

    if (!couponExist) {
      // console.log("No coupon matches the provided code.");
      return res.status(404).json({ error: "Coupon not found" });
    }

    if (couponExist.isUsed) {
      // console.log("Coupon code has already been used.");
      return res
        .status(400)
        .json({ error: "Coupon code has already been used" });
    }
    const coupon = await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $set: { isUsed: true } },
      { new: true }
    );

    if (coupon) {
      // console.log("Coupon found:", coupon);
      const allCoupons = await Coupon.find({}).sort({ createdAt: -1 });
      res.status(200).json({
        status: "success",
        message: "Coupons used successfully",
        data: allCoupons,
      });
    } else {
      // console.log("No coupon matches the provided code.");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
});
// All Coupon
router.get("/all_coupons", async (req, res) => {
  try {
    // Fetch all coupons and sort by createdAt in descending order (most recent first)
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
});

// Verify Coupon
router.post("/verify", async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found." });
  }

  if (coupon.isValid && new Date() < new Date(coupon.expiryDate)) {
    return res.json({ message: "Coupon is valid." });
  } else {
    return res
      .status(400)
      .json({ error: "Coupon is either invalid or expired." });
  }
});

module.exports = router;
