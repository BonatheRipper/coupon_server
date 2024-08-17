// utils/generateCoupon.js
const { v4: uuidv4 } = require("uuid");

const generateCouponCode = (prefix) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const getRandom = (chars, length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const section1 = getRandom(letters, 4); // e.g., NJTX
  const section2 = getRandom(numbers + letters, 4); // e.g., 48D5
  const section3 = getRandom(numbers + letters, 4); // e.g., 2WV8

  return `${prefix}-${section1}-${section2}-${section3}`;
};

module.exports = generateCouponCode;
