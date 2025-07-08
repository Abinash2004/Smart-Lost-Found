import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import NotificationBell from './NotificationBell';
import UserProfile from './UserProfile';
import { mainNavLinks, authNavLinks } from '../config/navigation';

// Reusable NavLink component for desktop navigation
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <div className="relative group">
      <Link
        to={to}
        className={`px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'text-white font-medium'
            : 'text-neutral-300 hover:text-white'
        }`}
      >
        {children}
        <span 
          className={`absolute -bottom-2 left-1/2 w-4/5 h-0.5 bg-white transform -translate-x-1/2 transition-all duration-200 ${
            isActive ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-50 scale-50 group-hover:scale-75'
          }`}
        />
      </Link>
    </div>
  );
};

// Reusable MobileNavLink component
const MobileNavLink = ({ to, children, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <div className="relative group w-full">
      <Link
        to={to}
        onClick={onClose}
        className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'text-white font-medium pl-6 border-l-2 border-white'
            : 'text-neutral-300 hover:text-white hover:pl-6 hover:border-l-2 hover:border-neutral-600'
        }`}
      >
        {children}
      </Link>
    </div>
  );
};

const Navbar = () => {
  const { token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-neutral-100 hover:text-white transition-colors">
                Smart Lost & Found
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {token && (
              <div className="flex items-center space-x-8 h-full">
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
                <NotificationBell />
                <div className="h-6 w-px bg-neutral-600"></div>
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex space-x-3">
                  {authNavLinks.map(({ to, label }, index) => {
                    const isLogin = label.toLowerCase() === 'login';
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          isLogin
                            ? 'text-white bg-neutral-800 border border-neutral-600 hover:bg-neutral-700 hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 focus:ring-offset-neutral-900 shadow-sm'
                            : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 focus:ring-offset-neutral-900'
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
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
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1 transition-colors border border-transparent hover:border-neutral-400"
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
        className={`fixed left-0 right-0 bg-neutral-950 border-t border-neutral-800 shadow-lg transition-all duration-300 ease-in-out w-full ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        style={{ top: '68px' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {token ? (
            <div className="space-y-1">
              {mainNavLinks.map(({ to, label }) => (
                <MobileNavLink key={to} to={to} onClose={() => setIsOpen(false)}>
                  {label}
                </MobileNavLink>
              ))}
              <div className="pt-3 border-t border-neutral-800 mt-2">
                <div className="px-4 py-3">
                  <UserProfile />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 py-2">
              {authNavLinks.map(({ to, label }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`w-full text-center px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    index === 0
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1'
                      : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
