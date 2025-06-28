const express = require("express");
const router = express.Router();
const { sendRegisterOtp, verifyRegisterOtp, sendLoginOtp, verifyLoginOtp } = require("../controllers/authController");

// Route to send OTP for registration
router.post("/send-register-otp", sendRegisterOtp);
// Route to verify OTP and register user
router.post("/verify-register-otp", verifyRegisterOtp);

// Route to verify OTP and Login user
router.post("/send-login-otp", sendLoginOtp);
// Route to verify OTP and Login user
router.post("/verify-login-otp", verifyLoginOtp);

module.exports = router;
