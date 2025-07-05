import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon } from '@heroicons/react/24/outline';
import { getNotifications } from '../lib/notificationApi';
import useAuthStore from '../store/useAuthStore';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const contactNumber = user?.contactNumber;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (contactNumber) {
      fetchNotifications();
    }
  }, [contactNumber]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!contactNumber) return;

    try {
      setIsLoading(true);
      const data = await getNotifications(contactNumber);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleNotificationClick = (notificationId, tag) => {
    // Mark the clicked notification as read (frontend only)
    setNotifications(prev =>
      prev.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );

    // Redirect
    if (tag === 'claim_received') {
      navigate('/found/mine');
    } else {
      navigate('/claims/mine');
    }

    setIsOpen(false);
  };

  const formatTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <ul>
                {notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification._id, notification.tag)}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      notification.isRead ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                See All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
