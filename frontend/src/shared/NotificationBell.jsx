import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getNotifications, markNotificationAsRead } from '../lib/notificationApi';
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

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read in the backend
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      }

      // Redirect based on notification tag
      if (notification.tag === 'claim_received') {
        navigate('/found/mine');
      } else if (notification.tag === 'claim_approved' || notification.tag === 'claim_rejected') {
        navigate('/claims/mine');
      } else {
        navigate('/');
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 relative cursor-pointer border border-transparent hover:border-gray-300"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-gray-600">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <BellIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 transition-colors duration-150 cursor-pointer ${
                      notification.isRead 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'bg-gray-50 hover:bg-gray-100 border-l-2 border-gray-900'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        notification.isRead ? 'bg-gray-200' : 'bg-gray-800'
                      }`}>
                        <BellIcon className={`h-4 w-4 ${notification.isRead ? 'text-gray-500' : 'text-white'}`} />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className={`text-sm ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-2">
                          <div className="h-2 w-2 rounded-full bg-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
