import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { getNotifications, markAllAsRead } from '../lib/notificationApi';
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

  const handleNotificationClick = (notification) => {
    // Mark notification as read in the local state
    const updatedNotifications = notifications.map(n => 
      n._id === notification._id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);

    // Navigate based on notification tag
    if (notification.tag === 'claim_received') {
      markAllAsRead(contactNumber).catch(console.error);
      navigate('/found/mine');
    } else if (notification.tag === 'claim_approved' || notification.tag === 'claim_rejected') {
      markAllAsRead(contactNumber).catch(console.error);
      navigate('/claims/mine');
    } else {
      // Default navigation if tag is not recognized
      markAllAsRead(contactNumber).catch(console.error);
      navigate('/');
    }
  };

  const formatTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500">You have no notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {notification.tag && (
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {notification.tag.split('_').join(' ')}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
