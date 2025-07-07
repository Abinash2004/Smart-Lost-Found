import { useState, useEffect, useRef } from 'react'
import { FiFilter, FiChevronDown, FiChevronRight } from 'react-icons/fi'
import {
  FiMonitor,
  FiFileText,
  FiKey,
  FiBox,
  FiAward,
  FiBook,
} from 'react-icons/fi'

export const categories = [
  { name: 'All Categories', icon: <FiFilter className="w-4 h-4" /> },
  { name: 'Electronics', icon: <FiMonitor className="w-4 h-4" /> },
  { name: 'Documents & ID', icon: <FiFileText className="w-4 h-4" /> },
  { name: 'Clothing & Accessories', icon: <FiAward className="w-4 h-4" /> },
  { name: 'Stationery & Books', icon: <FiBook className="w-4 h-4" /> },
  { name: 'Keys & Cards', icon: <FiKey className="w-4 h-4" /> },
  { name: 'Jewelry & Valuables', icon: <FiAward className="w-4 h-4" /> },
  { name: 'Miscellaneous', icon: <FiBox className="w-4 h-4" /> }
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
        className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition-all duration-150 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by category"
      >
        <FiFilter className="w-4 h-4 text-gray-500" />
        <span>{selectedCategory === 'All Categories' ? 'All Categories' : selectedCategory}</span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 focus:outline-none transition-all duration-100 transform opacity-100 scale-100">
          <div className="py-1.5">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onSelectCategory(category.name)
                  setIsOpen(false)
                }}
                className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  selectedCategory === category.name 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="w-4 h-4 mr-3 flex items-center justify-center">
                  {category.icon}
                </span>
                <span className="flex-1">{category.name}</span>
                {selectedCategory === category.name && (
                  <FiChevronRight className="w-4 h-4 text-gray-500" />
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
