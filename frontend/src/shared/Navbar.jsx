import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import { useState, useRef, useEffect } from 'react'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const timeoutRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 1000)
  }

  const { user } = useAuthStore()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Smart Lost & Found
      </Link>

      <div className="flex items-center space-x-6">
        {token && (
          <>
            {/* Dropdown for Found Items */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-gray-700 hover:text-blue-600 font-medium">
                Found Items
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow w-48 z-50">
                  <Link 
                    to="/found/post" 
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Post Found Item
                  </Link>
                  <Link 
                    to="/found/pending" 
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Pending Items
                  </Link>
                  <Link 
                    to="/found/resolved" 
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Resolved Items
                  </Link>
                  <Link 
                    to="/found/mine" 
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Found Posts
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/claims/mine"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              My Claims
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <div className="relative">
              <NotificationBell />
            </div>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-gray-700">{user?.name || 'User'}</span>
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="px-3 py-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
