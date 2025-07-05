const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    enum: ['claim_received', 'claim_approved', 'claim_rejected'],
    required: true,
    index: true  // ✅ Only this — removed duplicate manual index
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
