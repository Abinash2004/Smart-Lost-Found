import React, { useState, useEffect, useRef } from 'react'
import { FiFilter, FiChevronDown, FiChevronRight } from 'react-icons/fi'
import {
  FiMonitor,
  FiFileText,
  FiKey,
  FiBox,
  FiAward,
  FiBook,
} from 'react-icons/fi'

// Define icon components with their props
const categoryIcons = {
  filter: { component: FiFilter, className: 'w-4 h-4' },
  monitor: { component: FiMonitor, className: 'w-4 h-4' },
  fileText: { component: FiFileText, className: 'w-4 h-4' },
  award: { component: FiAward, className: 'w-4 h-4' },
  book: { component: FiBook, className: 'w-4 h-4' },
  key: { component: FiKey, className: 'w-4 h-4' },
  box: { component: FiBox, className: 'w-4 h-4' },
};

export const categories = [
  { name: 'All Categories', icon: 'filter' },
  { name: 'Electronics', icon: 'monitor' },
  { name: 'Documents & ID', icon: 'fileText' },
  { name: 'Clothing & Accessories', icon: 'award' },
  { name: 'Stationery & Books', icon: 'book' },
  { name: 'Keys & Cards', icon: 'key' },
  { name: 'Jewelry & Valuables', icon: 'award' },
  { name: 'Miscellaneous', icon: 'box' }
]

const CategoryFilter = ({ selectedCategory, onSelectCategory, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full gap-3 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
          isOpen 
            ? 'bg-neutral-800 border-neutral-600 text-white' 
            : 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600'
        } focus:outline-none focus:ring-1 focus:ring-neutral-500 cursor-pointer`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by category"
      >
        <div className="flex items-center gap-3">
          <FiFilter className="w-4 h-4 text-neutral-400" />
          <span className="truncate">{selectedCategory === 'All Categories' ? 'All Categories' : selectedCategory}</span>
        </div>
        <FiChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-lg bg-neutral-900 shadow-xl border border-neutral-700 focus:outline-none transition-all duration-200 transform opacity-100 scale-100 overflow-hidden">
          <div className="py-1.5">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onSelectCategory(category.name);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                  selectedCategory === category.name
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-300 hover:bg-neutral-700/70 hover:text-white'
                }`}
              >
                <span className="w-5 h-5 mr-3 flex items-center justify-center text-neutral-400">
                  {(() => {
                    const { component: Icon, className } = categoryIcons[category.icon] || categoryIcons.filter;
                    return (
                      <Icon 
                        className={`${className} ${selectedCategory === category.name ? 'text-white' : 'text-neutral-400'}`} 
                      />
                    );
                  })()}
                </span>
                <span className="flex-1 truncate">{category.name}</span>
                {selectedCategory === category.name && (
                  <FiChevronRight className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
