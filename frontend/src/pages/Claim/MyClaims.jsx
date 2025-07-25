import { useEffect, useState } from 'react'
import axios from '../../lib/axios'
import EmptyState from '../../shared/EmptyState'
import ClaimCard from '../../features/claim/ClaimCard'
import { FiChevronDown, FiAlertCircle } from 'react-icons/fi'
import StatusFilter from '../../components/StatusFilter'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

const MyClaims = () => {
  const [claims, setClaims] = useState([])
  const [displayedClaims, setDisplayedClaims] = useState([])
  const [filteredClaims, setFilteredClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')
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

  // Filter claims based on selected status
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredClaims(claims)
    } else {
      setFilteredClaims(claims.filter(claim => 
        claim.status?.toLowerCase() === selectedStatus.toLowerCase()
      ))
    }
    // Reset to first page when filter changes
    setPage(1)
  }, [claims, selectedStatus])

  // Update displayed claims when filteredClaims, page, or itemsPerPage changes
  useEffect(() => {
    if (filteredClaims.length > 0) {
      const endIndex = page * itemsPerPage
      setDisplayedClaims(filteredClaims.slice(0, endIndex))
    } else {
      setDisplayedClaims([])
    }
  }, [filteredClaims, page, itemsPerPage])

  useEffect(() => {
    const fetchClaimsWithItemInfo = async () => {
      try {
        // 1. Fetch all claims submitted by the user
        const res = await axios.get('/claim-items/personal')
        const rawClaims = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.claims)
            ? res.data.claims
            : []

        // 2. For each claim, fetch the associated found item using foundItemId
        const enrichedClaims = await Promise.all(
          rawClaims.map(async (claim) => {
            try {
              const foundItemRes = await axios.get(`/found-items/${claim.foundItemId}`)
              return {
                ...claim,
                foundItem: foundItemRes.data // attach found item info
              }
            } catch (err) {
              console.error(`Error fetching item for claim ${claim._id}:`, err)
              return {
                ...claim,
                foundItem: null // fallback
              }
            }
          })
        )

        // 3. Sort claims by createdAt (descending)
        const sorted = enrichedClaims.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setClaims(sorted)
      } catch (err) {
        console.error('Failed to fetch personal claims:', err)
        setClaims([])
      } finally {
        setLoading(false)
      }
    }

    fetchClaimsWithItemInfo()
  }, [])

  const handleLoadMore = () => {
    setLoadingMore(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setPage(prev => prev + 1)
      setLoadingMore(false)
    }, 300)
  }

  const hasMoreClaims = filteredClaims.length > displayedClaims.length

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                My Claims
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                View and manage your submitted claims
              </p>
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="w-full sm:w-64">
              <StatusFilter 
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
              />
            </div>
          </div>
          
          {/* Divider */}
          <div className="mt-6 border-t border-neutral-800"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-neutral-700 border-t-neutral-400 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-neutral-400">Loading your claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <EmptyState 
            icon={<FiAlertCircle className="w-12 h-12 text-neutral-400 mx-auto" />}
            title="No claims found"
            description="You haven't submitted any claims yet."
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center"
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedClaims.map((claim) => (
                <ClaimCard key={claim._id} claim={claim} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreClaims && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 w-full sm:w-auto max-w-xs ${
                    loadingMore 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer'
                  }`}
                  aria-label={loadingMore ? 'Loading more claims...' : 'Load more claims'}
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
          </>
        )}
      </div>
    </div>
  )
}

export default MyClaims
