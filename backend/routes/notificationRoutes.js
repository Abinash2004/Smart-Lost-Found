const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markAllAsRead
} = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware');

// Get all notifications for a user
router.get('/:contactNumber', verifyToken, getAllNotifications);

// Mark all notifications as read for a user
router.patch('/mark-all-read/:contactNumber', verifyToken, markAllAsRead);

module.exports = router;
