import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaPlusCircle, 
  FaClock,
  FaCheckCircle,
  FaListAlt,
  FaFileAlt,
  FaShieldAlt,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';
import { mainNavLinks, legalLinks } from '../config/navigation';

// Social media links
const socialLinks = [
  {
    name: 'Email',
    icon: FaEnvelope,
    href: 'mailto:abinashparida2021@gmail.com',
    color: 'text-gray-600 hover:text-red-500',
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    href: 'https://github.com/Abinash2004',
    color: 'text-gray-600 hover:text-gray-900',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/abinashparida28/',
    color: 'text-gray-600 hover:text-blue-600',
  },
  {
    name: 'Twitter',
    icon: FaTwitter,
    href: 'https://x.com/abinash_p28',
    color: 'text-gray-600 hover:text-blue-400',
  },
];

// Map route paths to icons
const routeIcons = {
  '/dashboard': <FaHome className="w-4 h-4" />,
  '/found/post': <FaPlusCircle className="w-4 h-4" />,
  '/found/pending': <FaClock className="w-4 h-4" />,
  '/found/resolved': <FaCheckCircle className="w-4 h-4" />,
  '/found/mine': <FaListAlt className="w-4 h-4" />,
  '/claims/mine': <FaFileAlt className="w-4 h-4" />,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const token = useAuthStore((state) => state.token);

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Smart Lost & Found helps reunite lost items with their owners through a community-driven approach.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {mainNavLinks.map(({ to, label }) => (
                token ? (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {routeIcons[to] || <FaSearch className="w-4 h-4" />}
                    <span>{label}</span>
                  </Link>
                ) : (
                  <div 
                    key={to}
                    className="flex items-center space-x-2 text-sm text-gray-300 cursor-not-allowed"
                    title="Please log in to access this feature"
                  >
                    {routeIcons[to] || <FaSearch className="w-4 h-4" />}
                    <span>{label}</span>
                  </div>
                )
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <nav className="space-y-3">
              {legalLinks.map(({ to, label }) => (
                <Link 
                  key={to} 
                  to={to} 
                  className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {label === 'Terms & Conditions' ? (
                    <FaFileAlt className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <FaShieldAlt className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {socialLinks.map(({ name, icon: Icon, href, color }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${color} p-2 rounded-full hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5`}
                    aria-label={name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Smart Lost & Found. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {legalLinks.map(({ to, label }) => (
                <Link 
                  key={to}
                  to={to}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
