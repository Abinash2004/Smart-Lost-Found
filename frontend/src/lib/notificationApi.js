import axiosInstance from './axios';

/**
 * Get all notifications for the current user
 * @param {string} contactNumber - User's contact number
 * @returns {Promise<Array>} Array of notification objects
 */
export const getNotifications = async (contactNumber) => {
  if (!contactNumber) {
    throw new Error('Contact number is required');
  }
  
  try {
    const response = await axiosInstance.get(`notifications/${contactNumber}`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} contactNumber - User's contact number
 * @returns {Promise<Object>} Response data
 */
export const markAllAsRead = async (contactNumber) => {
  if (!contactNumber) {
    throw new Error('Contact number is required');
  }
  
  try {
    const response = await axiosInstance.patch(`notifications/mark-all-read/${contactNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};
