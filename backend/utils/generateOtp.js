// utils/generateOtp.js
module.exports = function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
};
