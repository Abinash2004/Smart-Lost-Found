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
        className="flex items-center space-x-2 focus:outline-none group cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-gray-200 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-gray-300"
      >
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-medium group-hover:bg-gray-700 transition-all duration-200 shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">
            {user?.fullName || 'User'}
          </span>
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1.5 z-50 border border-gray-200">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
            onClick={() => setDropdownOpen(false)}
          >
            <PencilIcon className="h-4 w-4 mr-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span>Edit Profile</span>
          </Link>
          <div className="h-px w-full bg-gray-200 my-1"></div>
          <button
            onClick={() => {
              setDropdownOpen(false);
              handleLogout();
            }}
            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
