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
    <nav className="bg-gray-100 border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                Smart Lost & Found
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {token && (
              <div className="flex space-x-6">
                {mainNavLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}>
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-5">
            {token ? (
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                <NotificationBell />
                <div className="h-6 w-px bg-gray-200"></div>
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                <div className="flex space-x-3">
                  {authNavLinks.map(({ to, label }, index) => (
                    <Link
                      key={to}
                      to={to}
                      className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                        label === 'Login'
                          ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                          : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {token && (
              <div className="">
                <NotificationBell />
              </div>
            )}
            <DarkModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none transition-colors border border-transparent hover:border-gray-300"
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
        className={`fixed left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out w-full ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        style={{ top: '68px' }}
      >
        <div className="py-2 space-y-1 px-4">
          {token ? (
            <>
              {mainNavLinks.map(({ to, label }) => (
                <MobileNavLink key={to} to={to}>
                  {label}
                </MobileNavLink>
              ))}
              <div className="pt-3 border-t border-gray-200 mt-3">
                <UserProfile />
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-3 py-2">
              {authNavLinks.map(({ to, label }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`w-full text-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    index === 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md transform hover:-translate-y-0.5'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
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
    className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-200 hover:shadow-sm border border-transparent hover:border-gray-300"
  >
    {children}
  </Link>
)

// Reusable NavLink component for mobile navigation
const MobileNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 rounded-md mx-2"
  >
    {children}
  </Link>
)

export default Navbar
