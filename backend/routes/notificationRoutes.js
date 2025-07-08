const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markAllAsRead,
  markAsRead
} = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware');

// Get all notifications for a user
router.get('/:contactNumber', verifyToken, getAllNotifications);

// Mark a single notification as read
router.patch('/mark-read/:id', verifyToken, markAsRead);

// Mark all notifications as read for a user
router.patch('/mark-all-read/:contactNumber', verifyToken, markAllAsRead);

module.exports = router;
