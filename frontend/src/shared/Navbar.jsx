import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import { useState, useRef } from 'react'

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
                  <Link to="/found/post" className="block px-4 py-2 hover:bg-gray-100">
                    Post Found Item
                  </Link>
                  <Link to="/found/pending" className="block px-4 py-2 hover:bg-gray-100">
                    Pending Items
                  </Link>
                  <Link to="/found/resolved" className="block px-4 py-2 hover:bg-gray-100">
                    Resolved Items
                  </Link>
                  <Link to="/found/mine" className="block px-4 py-2 hover:bg-gray-100">
                    My Found Posts
                  </Link>
                </div>
              )}
            </div>

            {/* 🔗 My Claims Link */}
            <Link
              to="/claims/mine"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              My Claims
            </Link>
          </>
        )}

        {!token ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
