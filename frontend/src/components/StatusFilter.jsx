import { useState, useEffect, useRef } from 'react'
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
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          id="status-filter-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">{selectedStatusData.icon}</span>
            <span>{selectedStatusData.name}</span>
          </div>
          <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="status-filter-button">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onSelectStatus(status.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center px-4 py-2 text-sm text-left ${
                  selectedStatus === status.value
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span className="w-4 h-4 mr-3 flex items-center justify-center">
                  {status.icon}
                </span>
                <span className="flex-1">{status.name}</span>
                {selectedStatus === status.value && (
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

export default StatusFilter
