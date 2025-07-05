const express = require("express");
const router = express.Router();
const { 
  sendRegisterOtp, 
  verifyRegisterOtp, 
  sendPasswordOtp, 
  verifyPasswordOtp,
  updatePassword,
  login
} = require("../controllers/authController");

// Registration routes
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);

// Password reset routes
router.post("/send-password-otp", sendPasswordOtp);
router.post("/verify-password-otp", verifyPasswordOtp);
router.post("/update-password", updatePassword);

// Login route
router.post("/login", login);

module.exports = router;
