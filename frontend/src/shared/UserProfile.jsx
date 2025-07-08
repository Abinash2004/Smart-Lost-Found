import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { PencilIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none group cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-neutral-800/50 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-neutral-600"
      >
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neutral-300 text-black flex items-center justify-center font-medium group-hover:bg-neutral-200 transition-all duration-200 shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-neutral-200 text-sm font-medium group-hover:text-white transition-colors duration-200">
            {user?.fullName || 'User'}
          </span>
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-800 rounded-lg shadow-lg py-1.5 z-50 border border-neutral-700">
          <div className="px-4 py-2.5 border-b border-neutral-700">
            <p className="text-xs font-medium text-neutral-400">Signed in as</p>
            <p className="text-sm font-medium text-white truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-700/50 transition-all duration-200 group"
            onClick={() => setDropdownOpen(false)}
          >
            <PencilIcon className="h-4 w-4 mr-3 text-neutral-400 group-hover:text-white" />
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group flex items-center cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-red-500 group-hover:text-red-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
