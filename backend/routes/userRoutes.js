const express = require("express");
const router = express.Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// Protected routes (require JWT authentication)
router.get("/me", verifyToken, getCurrentUser);
router.put("/profile", verifyToken, updateUserProfile);

module.exports = router;
