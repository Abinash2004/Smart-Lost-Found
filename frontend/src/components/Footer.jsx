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

// Social media links with grayscale hover states
const socialLinks = [
  {
    name: 'Email',
    icon: FaEnvelope,
    href: 'mailto:abinashparida2021@gmail.com',
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    href: 'https://github.com/Abinash2004',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/abinashparida28/',
  },
  {
    name: 'Twitter',
    icon: FaTwitter,
    href: 'https://x.com/abinash_p28',
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
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
          {/* Brand Section */}
          <div className="space-y-5 w-full">
            <div className="flex items-center space-x-2">
              <FaSearch className="w-6 h-6 text-gray-900" />
              <span className="text-xl font-bold text-gray-900">Smart Lost & Found</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Reuniting lost items with their owners through community collaboration and smart technology.
            </p>
            
            <div className="flex space-x-4 pt-2">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/80 hover:bg-white transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md border border-gray-200/80"
                  aria-label={name}
                >
                  <Icon className="w-4 h-4 text-gray-700 hover:text-gray-900 transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 w-full">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="space-y-3">
              {mainNavLinks.map(({ to, label }) => {
                const Icon = routeIcons[to]?.type || FaSearch;
                return token ? (
                  <Link 
                    key={to} 
                    to={to} 
                    className="group flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-all duration-200"
                  >
                    <span className="text-gray-500 group-hover:text-gray-800 transition-colors duration-200">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="border-b border-transparent group-hover:border-gray-600 transition-colors duration-200">
                      {label}
                    </span>
                  </Link>
                ) : (
                  <div 
                    key={to}
                    className="flex items-center space-x-3 text-sm text-gray-400 cursor-not-allowed group"
                    title="Please log in to access this feature"
                  >
                    <span className="text-gray-300">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>{label}</span>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-5 w-full">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <nav className="space-y-3">
              {legalLinks.map(({ to, label }) => (
                <Link 
                  key={to} 
                  to={to} 
                  className="group flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-all duration-200"
                >
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    {label === 'Terms & Conditions' ? (
                      <FaFileAlt className="w-4 h-4" />
                    ) : (
                      <FaShieldAlt className="w-4 h-4" />
                    )}
                  </span>
                  <span className="border-b border-transparent group-hover:border-gray-400 transition-colors duration-200">
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5 w-full">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <FaEnvelope className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Have questions?</p>
                  <a 
                    href="mailto:abinashparida2021@gmail.com" 
                    className="text-sm font-medium text-gray-800 hover:text-gray-900 hover:underline transition-colors duration-200"
                  >
                    abinashparida2021@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-sm text-gray-600 text-center md:text-left">
              &copy; {currentYear} Smart Lost & Found. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>Built with</span>
              <span className="text-red-400">❤️</span>
              <span>and</span>
              <span className="text-amber-600">☕</span>
              <span>by</span>
              <a 
                href="https://github.com/Abinash2004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-gray-800 hover:text-gray-900 hover:underline transition-colors duration-200"
              >
                Abinash Parida
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
