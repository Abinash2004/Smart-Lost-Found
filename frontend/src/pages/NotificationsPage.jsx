import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiBell, FiCheckCircle, FiChevronRight, FiCheck, FiClock, FiAlertCircle, FiCheckSquare, FiInbox } from 'react-icons/fi';
import { getNotifications, markAllAsRead, markNotificationAsRead } from '../lib/notificationApi';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';

const NotificationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const contactNumber = user?.contactNumber;
  const navigate = useNavigate();
  const { notifications, setNotifications, markAllAsRead: markAllAsReadInStore } = useNotificationStore();

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
      // Mark notification as read in the backend and update store
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        // The store will handle updating the notification state
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
      markAllAsReadInStore();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors duration-200">
              <FiChevronRight className="transform rotate-180 mr-1.5 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
            </div>
            <div className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-neutral-800 rounded-full mb-4"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors duration-200">
            <FiChevronRight className="transform rotate-180 mr-1.5 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Notifications Card */}
        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-neutral-900/50">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center">
              <FiBell className="h-6 w-6 text-white mr-3" />
              <h1 className="text-xl font-bold text-white">Notifications</h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors duration-200 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="mx-auto h-16 w-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <FiBell className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No notifications yet</h3>
              <p className="text-sm text-neutral-400">When you get notifications, they'll appear here</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-800 max-h-[calc(100vh-250px)] overflow-y-auto">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-5 transition-colors duration-200 cursor-pointer ${
                    notification.isRead 
                      ? 'bg-neutral-900 hover:bg-neutral-800/80' 
                      : 'bg-neutral-800/70 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      notification.isRead ? 'bg-neutral-800' : 
                      notification.tag === 'claim_received' ? 'bg-blue-900/20' :
                      notification.tag === 'claim_approved' ? 'bg-green-900/20' :
                      notification.tag === 'claim_rejected' ? 'bg-red-900/20' : 'bg-neutral-300'
                    }`}>
                      {notification.tag === 'claim_received' && <FiInbox className={`h-5 w-5 ${notification.isRead ? 'text-blue-400' : 'text-blue-400'}`} />}
                      {notification.tag === 'claim_approved' && <FiCheckCircle className={`h-5 w-5 ${notification.isRead ? 'text-green-400' : 'text-green-400'}`} />}
                      {notification.tag === 'claim_rejected' && <FiAlertCircle className={`h-5 w-5 ${notification.isRead ? 'text-red-400' : 'text-red-400'}`} />}
                      {!['claim_received', 'claim_approved', 'claim_rejected'].includes(notification.tag) && (
                        <FiBell className={`h-5 w-5 ${notification.isRead ? 'text-neutral-400' : 'text-neutral-300'}`} />
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className={`text-sm ${
                        notification.isRead ? 'text-neutral-300' : 'text-white font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-1.5 flex items-center text-xs text-neutral-500">
                        <FiClock className="mr-1.5 h-3.5 w-3.5" />
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {notification.tag && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            notification.tag === 'claim_received' 
                              ? 'bg-blue-900/20 text-blue-300/90 border border-blue-800/30' 
                              : notification.tag === 'claim_approved'
                                ? 'bg-green-900/20 text-green-300/90 border border-green-800/30'
                                : notification.tag === 'claim_rejected'
                                  ? 'bg-red-900/20 text-red-300/90 border border-red-800/30'
                                  : 'bg-neutral-800/50 text-neutral-300/90 border border-neutral-700/50'
                          }`}>
                            {notification.tag.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <FiChevronRight className="h-5 w-5 text-neutral-600" />
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
