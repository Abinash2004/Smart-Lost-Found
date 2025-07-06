import React, { useEffect, useState, useRef } from 'react'
import axios from '../../lib/axios'
import FoundCard from '../../features/found/FoundCard'
import LoadingSpinner from '../../shared/LoadingSpinner'
import EmptyState from '../../shared/EmptyState'
import useAuthStore from '../../store/useAuthStore'
import { FiFilter, FiChevronDown, FiMonitor, FiFileText, FiAward, FiBook, FiKey, FiBox, FiLoader, FiPlus } from 'react-icons/fi'

const categories = [
  { name: 'All Categories', icon: FiFilter },
  { name: 'Electronics', icon: FiMonitor },
  { name: 'Documents & ID', icon: FiFileText },
  { name: 'Clothing & Accessories', icon: FiAward },
  { name: 'Stationery & Books', icon: FiBook },
  { name: 'Keys & Cards', icon: FiKey },
  { name: 'Jewelry & Valuables', icon: FiAward },
  { name: 'Miscellaneous', icon: FiBox },
]

const FoundList = ({ filter }) => {
  const [items, setItems] = useState([])
  const [displayedItems, setDisplayedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 6
  )
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = window.innerWidth < 640 ? 3 : 6
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage)
        // Reset to first page when changing items per page
        setPage(1)
      }
    }

    // Set initial items per page
    handleResize()
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [itemsPerPage])

  // Update displayed items when items, page, or itemsPerPage changes
  useEffect(() => {
    if (items.length > 0) {
      const endIndex = page * itemsPerPage
      setDisplayedItems(items.slice(0, endIndex))
    }
  }, [items, page, itemsPerPage])

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
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const endpoint = filter === 'Mine' ? '/found-items/personal' : '/found-items'
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })

        let data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
            ? res.data.items
            : []

        // Apply status filter
        if (filter === 'Pending' || filter === 'Resolved') {
          data = data.filter((item) => item.status === filter)
        }

        // Apply category filter
        if (selectedCategory !== 'All Categories') {
          data = data.filter((item) => item.categoryTag === selectedCategory)
        }

        // Sort by latest foundDate
        data.sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate))

        setItems(data)
      } catch (err) {
        console.error('Failed to fetch found items:', err.response?.data || err.message)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [filter, token, selectedCategory])

  const handleDelete = (id) => {
    const newItems = items.filter((item) => item._id !== id)
    setItems(newItems)
    
    // If the last item on the current page was deleted, go back a page
    if (displayedItems.length % itemsPerPage === 1 && page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleLoadMore = () => {
    setLoadingMore(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setPage(prev => prev + 1)
      setLoadingMore(false)
    }, 300)
  }

  const hasMoreItems = items.length > displayedItems.length

  // Get the page title based on the filter prop
  const getPageTitle = () => {
    switch(filter) {
      case 'Pending':
        return 'Pending Items';
      case 'Resolved':
        return 'Resolved Items';
      case 'Mine':
        return 'My Found Items';
      default:
        return 'All Found Items';
    }
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header with Title and Filter */}
      <div className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filter === 'Pending' ? 'Items awaiting resolution' : 
             filter === 'Resolved' ? 'Successfully resolved items' : 
             'Items you have reported as found'}
          </p>
        </div>
        
        {/* Category Filter - Right-aligned container */}
        <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex items-center gap-3">
          {/* Selected Category Badge */}
          {selectedCategory !== 'All Categories' && (
            <div className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              {categories.find(cat => cat.name === selectedCategory)?.icon && 
                React.createElement(categories.find(cat => cat.name === selectedCategory).icon, { 
                  className: "w-3 h-3 mr-1" 
                })
              }
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory('All Categories')}
                className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer"
                aria-label="Clear filter"
              >
                ×
              </button>
            </div>
          )}
          
          {/* Category Filter Dropdown */}
          <div className="relative right-0" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-label="Filter by category"
            >
              <FiFilter className="w-4 h-4 text-gray-500" />
              <span>Filter by Category</span>
              <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left cursor-pointer ${
                          selectedCategory === category.name 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3 text-gray-500" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState message="No found items to display." />
        ) : (
          <div className="space-y-6">
            <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map((item, index) => {
                // Calculate row and column for staggered animation
                const row = Math.floor(index / 3);
                const col = index % 3;
                const delay = (row * 100) + (col * 50);
                
                return (
                  <div 
                    key={item._id}
                    className="animate-slideIn"
                    style={{
                      animationDelay: `${Math.min(delay, 300)}ms`,
                      opacity: 0,
                      animationFillMode: 'forwards',
                      transform: 'translateY(10px)'
                    }}
                  >
                    <FoundCard
                      item={item}
                      onDelete={handleDelete}
                      showDelete={filter === 'Mine'}
                      showClaims={filter === 'Mine'}
                      filter={filter}
                    />
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMoreItems && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ease-in-out ${
                    loadingMore 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer'
                  }`}
                  aria-label={loadingMore ? 'Loading more items' : 'Load more items'}
                >
                  {loadingMore ? (
                    <>
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="w-3.5 h-3.5" />
                      <span>Load More</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default FoundList
