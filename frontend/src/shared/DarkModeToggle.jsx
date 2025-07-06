import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved user preference or use system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.theme === 'dark' || 
                    (!('theme' in localStorage) && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      updateTheme(isDark);
    }
  }, []);

  // Update the theme and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
    localStorage.theme = newDarkMode ? 'dark' : 'light';
  };

  // Apply theme to document
  const updateTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm transition-all duration-200 relative cursor-pointer border border-transparent hover:border-gray-300"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <MoonIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
