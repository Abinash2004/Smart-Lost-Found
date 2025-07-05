// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redisClient");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

const sendRegisterOtp = async (req, res) => {
  try {
    const { email, fullName, password, contactNumber, designation } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // 2. Generate OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 3. Store OTP + user data in Redis with TTL (5 min)
    const redisKey = `register:${email}`;
    const userData = JSON.stringify({ fullName, email, password, contactNumber, designation, hashedOtp });

    await redisClient.setEx(redisKey, 300, userData); // TTL = 5 mins

    // 4. Send Email
    await sendEmail(email, "Your OTP for Smart Lost & Found", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const redisKey = `register:${email}`;
    const userDataString = await redisClient.get(redisKey);

    if (!userDataString)
      return res.status(400).json({ message: "OTP expired or invalid" });

    const { fullName, password, contactNumber, designation, hashedOtp } = JSON.parse(userDataString);

    const isMatch = await bcrypt.compare(otp, hashedOtp);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid OTP" });

    // Hash password again (safer than reusing in case Redis is compromised)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      contactNumber,
      designation
    });

    await newUser.save();

    // Delete OTP from Redis after successful verification
    await redisClient.del(redisKey);

    // Create JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        contactNumber: newUser.contactNumber,
        designation: newUser.designation
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
        designation: newUser.designation
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Generate OTP and hash
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 3. Store OTP in Redis with TTL (5 min)
    const redisKey = `reset-password:${email}`;
    await redisClient.setEx(redisKey, 300, hashedOtp);

    // 4. Send OTP via email
    await sendEmail(email, "Password Reset OTP", `Your OTP for password reset is: ${otp}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const redisKey = `reset-password:${email}`;
    const hashedOtp = await redisClient.get(redisKey);

    if (!hashedOtp) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, hashedOtp);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Generate a reset token that will be used to update the password
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived token for security
    );

    // Store the reset token in Redis with a short TTL
    const resetTokenKey = `reset-token:${email}`;
    await redisClient.setEx(resetTokenKey, 900, resetToken); // 15 minutes

    // Delete the OTP after successful verification
    await redisClient.del(redisKey);

    res.status(200).json({ 
      message: "OTP verified successfully",
      resetToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    // 1. Verify the reset token
    const resetTokenKey = `reset-token:${email}`;
    const storedToken = await redisClient.get(resetTokenKey);

    if (!storedToken || storedToken !== resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the user's password
    user.password = hashedPassword;
    await user.save();

    // 5. Delete the used reset token
    await redisClient.del(resetTokenKey);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        contactNumber: user.contactNumber,
        designation: user.designation
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    // 4. Return user data (excluding password) and token
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      contactNumber: user.contactNumber,
      designation: user.designation
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = {
  sendRegisterOtp,
  verifyRegisterOtp,
  sendPasswordOtp,
  verifyPasswordOtp,
  updatePassword,
  login
};