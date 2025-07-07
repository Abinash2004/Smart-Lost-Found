import React, { useEffect, useState } from 'react'
import axios from '../../lib/axios'
import FoundCard from '../../features/found/FoundCard'
import { FiLoader, FiChevronDown, FiFileText } from 'react-icons/fi'
import useAuthStore from '../../store/useAuthStore'



const FoundList = ({ filter, selectedCategory = 'All Categories' }) => {
  const [items, setItems] = useState([])
  const [displayedItems, setDisplayedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 6
  )
  const [page, setPage] = useState(1)

  
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

        // Apply category filter if a category is selected
        if (selectedCategory && selectedCategory !== 'All Categories') {
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

    if (token) {
      fetchItems()
    }
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
    <div className="w-full">
      <div className="w-full overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-500">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiFileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {selectedCategory !== 'All Categories' 
                ? `No ${selectedCategory.toLowerCase()} items found. Try another category.`
                : 'No items match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6 bg-transparent">
            <div className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map((item, index) => (
                <div 
                  key={item._id}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${Math.min(index * 50, 300)}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
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
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreItems && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 w-full sm:w-auto max-w-xs ${
                    loadingMore 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer'
                  }`}
                  aria-label={loadingMore ? 'Loading more items' : 'Load more items'}
                >
                  {loadingMore ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="w-4 h-4" />
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
  )
}

export default FoundList
