import React, { useState, useEffect, useRef } from 'react'
import { FiFilter, FiChevronDown, FiChevronRight, FiClock, FiCheck, FiX } from 'react-icons/fi'

export const statuses = [
  { name: 'No Filter', value: 'all', icon: <FiFilter className="w-4 h-4" /> },
  { name: 'Pending', value: 'pending', icon: <FiClock className="w-4 h-4" /> },
  { name: 'Approved', value: 'approved', icon: <FiCheck className="w-4 h-4" /> },
  { name: 'Rejected', value: 'rejected', icon: <FiX className="w-4 h-4" /> },
]

const StatusFilter = ({ selectedStatus, onSelectStatus, className = '' }) => {
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

  const selectedStatusData = statuses.find(s => s.value === selectedStatus) || statuses[0]

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
        aria-label="Filter by status"
      >
        <div className="flex items-center gap-3">
          <FiFilter className="w-4 h-4 text-neutral-400" />
          <span className="truncate">{selectedStatusData.name}</span>
        </div>
        <FiChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg bg-neutral-900 shadow-xl border border-neutral-700 focus:outline-none transition-all duration-200 transform opacity-100 scale-100 overflow-hidden">
          <div className="py-1.5">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onSelectStatus(status.value);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                  selectedStatus === status.value
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-300 hover:bg-neutral-700/70 hover:text-white'
                }`}
              >
                <span className="w-5 h-5 mr-3 flex items-center justify-center text-neutral-400">
                  {React.cloneElement(status.icon, {
                    className: `${status.icon.props.className || ''} ${
                      selectedStatus === status.value ? 'text-white' : 'text-neutral-400'
                    }`
                  })}
                </span>
                <span className="flex-1 truncate">{status.name}</span>
                {selectedStatus === status.value && (
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

export default StatusFilter
