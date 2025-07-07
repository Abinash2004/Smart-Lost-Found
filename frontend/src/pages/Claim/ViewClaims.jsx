import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../lib/axios'
import LoadingSpinner from '../../shared/LoadingSpinner'
import EmptyState from '../../shared/EmptyState'
import { format } from 'date-fns'
import ClaimCard from '../../features/claim/ClaimCard'

const ViewClaims = () => {
  const { foundItemId } = useParams()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemInfo, setItemInfo] = useState(null)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // First get the found item details
        const itemRes = await axios.get(`/found-items/${foundItemId}`)
        const foundItem = itemRes.data
        
        // Then get the claims for this item
        const res = await axios.get(`/claim-items/found/${foundItemId}`)
        const rawClaims = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.claims)
            ? res.data.claims
            : []

        // Attach foundItem to each claim
        const claimsWithItem = rawClaims.map(claim => ({
          ...claim,
          foundItem: foundItem
        }))

        const sortedClaims = claimsWithItem.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setClaims(sortedClaims)
        setItemInfo(foundItem)
      } catch (err) {
        console.error('Failed to fetch claims:', err)
        setClaims([])
      } finally {
        setLoading(false)
      }
    }

    const fetchItemDetails = async () => {
      try {
        const res = await axios.get(`/found-items`)
        const allItems = Array.isArray(res.data) ? res.data : []
        const matched = allItems.find((item) => item._id === foundItemId)
        setItemInfo(matched)
      } catch (err) {
        console.error('Failed to fetch item info:', err)
      }
    }

    fetchClaims()
    fetchItemDetails()
  }, [foundItemId])

  const handleApprove = async (claimId) => {
    const confirm = window.confirm('Are you sure you want to approve this claim?')
    if (!confirm) return
    try {
      await axios.patch(`/claim-items/approve/${claimId}`)
      alert('Claim approved successfully.')
      window.location.reload()
    } catch (err) {
      console.error('Error approving claim:', err)
      alert('Failed to approve claim.')
    }
  }

  const handleReject = async (claimId) => {
    const feedback = window.prompt('Enter rejection feedback (optional):') || 'Your description did not match the item.'
    try {
      await axios.patch(`/claim-items/reject/${claimId}`, { feedback: feedback })
      alert('Claim rejected.')
      window.location.reload()
    } catch (err) {
      console.error('Error rejecting claim:', err)
      alert('Failed to reject claim.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const isOwner = true // Add ownership logic if needed

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Found Item Claims</h1>
              {itemInfo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{itemInfo.title}</span> • 
                    Found on {format(new Date(itemInfo.foundDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
              >
                ← Back to Found Items
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {claims.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No claims yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No one has submitted a claim for this item yet. Check back later or share the item to help find its owner.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {claims.length} {claims.length === 1 ? 'Claim' : 'Claims'} Received
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claims.map((claim) => (
                  <div key={claim._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <ClaimCard
                      claim={claim}
                      showActions={isOwner}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewClaims
