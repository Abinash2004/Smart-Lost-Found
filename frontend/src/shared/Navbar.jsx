import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import NotificationBell from './NotificationBell';
import UserProfile from './UserProfile';
import DarkModeToggle from './DarkModeToggle';
import { mainNavLinks, authNavLinks } from '../config/navigation';

const Navbar = () => {
  const { token } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Smart Lost & Found
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {token && (
              <div className="flex space-x-8">
                {mainNavLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}>
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-6">
            {token ? (
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                <NotificationBell />
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                {authNavLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-1.5 rounded-md font-medium transition-colors ${
                      label === 'Login'
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {token && (
              <div className="mr-4">
                <NotificationBell />
              </div>
            )}
            <DarkModeToggle className="mr-4" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        ref={menuRef}
        className={`md:hidden transition-all duration-300 ease-in-out w-full ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="pt-2 pb-3 space-y-1 px-2">
          {token ? (
            <>
              {mainNavLinks.map(({ to, label }) => (
                <MobileNavLink key={to} to={to}>
                  {label}
                </MobileNavLink>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <UserProfile />
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-4 pt-2">
              {authNavLinks.map(({ to, label }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium ${
                    index === 0
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

// Reusable NavLink component for desktop navigation
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-3 py-2 rounded-md"
  >
    {children}
  </Link>
)

// Reusable NavLink component for mobile navigation
const MobileNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
  >
    {children}
  </Link>
)

export default Navbar
