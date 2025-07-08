import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, ClockIcon, CheckIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getNotifications, markNotificationAsRead } from '../lib/notificationApi';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const contactNumber = user?.contactNumber;
  
  const { notifications, unreadCount, setNotifications, markAsRead } = useNotificationStore();

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

  const [updatingId, setUpdatingId] = useState(null);

  const handleNotificationClick = async (notification) => {
    // Don't process clicks if already updating this notification
    if (updatingId === notification._id) return;
    
    try {
      // Mark notification as read in the backend and update store
      if (!notification.isRead) {
        setUpdatingId(notification._id);
        await markNotificationAsRead(notification._id);
        markAsRead(notification._id);
      }

      // Close the dropdown before navigation
      setIsOpen(false);
      
      // Small delay to allow dropdown to close before navigation
      setTimeout(() => {
        // Redirect based on notification tag
        if (notification.tag === 'claim_received') {
          navigate('/found/mine');
        } else if (notification.tag === 'claim_approved' || notification.tag === 'claim_rejected') {
          navigate('/claims/mine');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (error) {
      console.error('Error handling notification click:', error);
      // Optional: Show error toast to user
      // toast.error('Failed to update notification status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 focus:ring-offset-neutral-900 relative transition-colors duration-200 cursor-pointer"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-white text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center border border-neutral-200 shadow-sm leading-none">
            <span className="mt-px">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-800 rounded-lg shadow-lg overflow-y-auto max-h-[70vh] z-50 border border-neutral-700
          scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="p-3 border-b border-neutral-700 bg-neutral-800/95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    notifications.forEach(notification => markAsRead(notification._id));
                  }}
                  className="text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-neutral-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <BellIcon className="mx-auto h-8 w-8 text-neutral-500" />
                <h3 className="mt-2 text-sm font-medium text-white">No notifications</h3>
                <p className="mt-1 text-sm text-neutral-400">You don't have any notifications yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-700">
                {notifications.slice(0, 5).map((notification) => (
                  <li 
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 transition-colors duration-150 ${
                      notification.isRead 
                        ? 'bg-neutral-900 hover:bg-neutral-700/50' 
                        : 'bg-neutral-800 hover:bg-neutral-700/50'
                    } ${
                      updatingId === notification._id 
                        ? 'opacity-70 cursor-wait' 
                        : 'cursor-pointer'
                    }`}
                    aria-busy={updatingId === notification._id}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {notification.type === 'success' || notification.tag === 'claim_approved' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        ) : notification.type === 'error' || notification.tag === 'claim_rejected' ? (
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        ) : (
                          <BellIcon className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white">
                          {notification.title || 
                           (notification.tag === 'claim_received' && 'New Claim Received') ||
                           (notification.tag === 'claim_approved' && 'Claim Approved') ||
                           (notification.tag === 'claim_rejected' && 'Claim Rejected') ||
                           'Notification'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-neutral-500">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="bg-neutral-800/95 px-4 py-2.5 text-center border-t border-neutral-700">
              <Link
                to="/notifications"
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
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
