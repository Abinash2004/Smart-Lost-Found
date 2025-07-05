const Notification = require('../models/Notification');

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/v1/notifications/:contactNumber
 * @access  Private
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    
    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Contact number is required'
      });
    }

    const notifications = await Notification.find({ contactNumber })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Mark all notifications as read for a user
 * @route   PATCH /api/v1/notifications/mark-all-read/:contactNumber
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    
    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Contact number is required'
      });
    }

    const result = await Notification.updateMany(
      { contactNumber, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: result
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};