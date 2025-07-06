import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiBell, FiCheckCircle, FiChevronRight, FiCheck, FiClock } from 'react-icons/fi';
import { getNotifications, markAllAsRead, markNotificationAsRead } from '../lib/notificationApi';
import useAuthStore from '../store/useAuthStore';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const contactNumber = user?.contactNumber;
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!contactNumber) return;

    try {
      setIsLoading(true);
      const data = await getNotifications(contactNumber);
      const sortedNotifications = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contactNumber]);

  useEffect(() => {
    if (contactNumber) {
      fetchNotifications();
    }
  }, [contactNumber, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read in the backend
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        // Update local state
        const updatedNotifications = notifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifications);
      }

      // Navigate based on notification tag
      if (notification.tag === 'claim_received') {
        navigate('/found/mine');
      } else if (notification.tag === 'claim_approved' || notification.tag === 'claim_rejected') {
        navigate('/claims/mine');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(contactNumber);
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <FiChevronRight className="transform rotate-180 mr-1.5 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>
            <div className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <FiChevronRight className="transform rotate-180 mr-1.5 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FiBell className="h-6 w-6 text-gray-900 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
                disabled={notifications.every(n => n.isRead)}
              >
                <FiCheck className="mr-1.5 h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiBell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications yet</h3>
              <p className="text-sm text-gray-500">When you get notifications, they'll appear here</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-5 transition-colors duration-200 cursor-pointer ${
                    notification.isRead 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-900'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      notification.isRead ? 'bg-gray-200' : 'bg-gray-800'
                    }`}>
                      <FiBell className={`h-5 w-5 ${notification.isRead ? 'text-gray-500' : 'text-white'}`} />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className={`text-sm ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-1.5 flex items-center text-xs text-gray-500">
                        <FiClock className="mr-1 h-3.5 w-3.5" />
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {notification.tag && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {notification.tag.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <FiChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
