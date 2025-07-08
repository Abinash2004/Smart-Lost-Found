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
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-auto relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(229,231,235,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(229,231,235,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
          {/* Brand Section */}
          <div className="space-y-5 w-full">
            <div className="flex items-center space-x-2">
              <FaSearch className="w-6 h-6 text-neutral-100" />
              <span className="text-xl font-bold text-neutral-100">Smart Lost & Found</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Reuniting lost items with their owners through community collaboration and smart technology.
            </p>
            
            <div className="flex space-x-4 pt-2">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md border border-neutral-700/80"
                  aria-label={name}
                >
                  <Icon className="w-4 h-4 text-neutral-300 hover:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 w-full">
            <h3 className="text-sm font-medium text-neutral-100 uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="space-y-3">
              {mainNavLinks.map(({ to, label }) => {
                const Icon = routeIcons[to]?.type || FaSearch;
                return token ? (
                  <Link 
                    key={to} 
                    to={to} 
                    className="group flex items-center space-x-3 text-sm text-neutral-400 hover:text-neutral-100 transition-all duration-200"
                  >
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="border-b border-transparent group-hover:border-neutral-400 transition-colors duration-200">
                      {label}
                    </span>
                  </Link>
                ) : (
                  <div 
                    key={to}
                    className="flex items-center space-x-3 text-sm text-neutral-600 cursor-not-allowed group"
                    title="Please log in to access this feature"
                  >
                    <span className="text-neutral-600">
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
            <h3 className="text-sm font-medium text-neutral-100 uppercase tracking-wider">
              Legal
            </h3>
            <nav className="space-y-3">
              {legalLinks.map(({ to, label }) => (
                <Link 
                  key={to} 
                  to={to} 
                  className="group flex items-center space-x-3 text-sm text-neutral-400 hover:text-neutral-100 transition-all duration-200"
                >
                  <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200">
                    {label === 'Terms & Conditions' ? (
                      <FaFileAlt className="w-4 h-4" />
                    ) : (
                      <FaShieldAlt className="w-4 h-4" />
                    )}
                  </span>
                  <span className="border-b border-transparent group-hover:border-neutral-500 transition-colors duration-200">
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5 w-full">
            <h3 className="text-sm font-medium text-neutral-100 uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <FaEnvelope className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Have questions?</p>
                  <a 
                    href="mailto:abinashparida2021@gmail.com" 
                    className="text-sm font-medium text-neutral-200 hover:text-white hover:underline transition-colors duration-200"
                  >
                    abinashparida2021@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-sm text-neutral-500 text-center md:text-left">
              &copy; {currentYear} Smart Lost & Found. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-neutral-500">
              <span>Built with</span>
              <span className="text-red-400">❤️</span>
              <span>and</span>
              <span className="text-amber-500">☕</span>
              <span>by</span>
              <a 
                href="https://github.com/Abinash2004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-neutral-300 hover:text-white hover:underline transition-colors duration-200"
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
