import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../lib/axios'
import LoadingSpinner from '../../shared/LoadingSpinner'
import EmptyState from '../../shared/EmptyState'
import { format } from 'date-fns'
import ClaimCard from '../../features/claim/ClaimCard'
import { FiAlertCircle, FiClock } from 'react-icons/fi'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

const ViewClaims = () => {
  const { foundItemId } = useParams()
  const [claims, setClaims] = useState([])
  const [itemInfo, setItemInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
      <div className="min-h-screen bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-neutral-700 border-t-neutral-400 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-neutral-400">Loading claims...</p>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = true // Add ownership logic if needed

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
              <FiClock className="w-6 h-6 text-blue-500" />
              {itemInfo ? `Claims for ${itemInfo.title}` : 'Item Claims'}
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              {itemInfo?.description || 'Viewing all claims for this item'}
            </p>
          </div>
          
          <div className="mt-6 border-t border-neutral-800"></div>
        </div>
        
        {claims.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <FiAlertCircle className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-100">No Claims Found</h3>
              <p className="text-sm text-neutral-400 max-w-md">
                There are currently no claims submitted for this item. Check back later.
              </p>
              {itemInfo && (
                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors duration-200 flex items-center cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Items
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claims.map((claim) => (
                <div key={claim._id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-neutral-700">
                  <ClaimCard
                    claim={claim}
                    showActions={isOwner}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </div>
              ))}
            </div>
            

          </>
        )}
      </div>
    </div>
  )
}

export default ViewClaims
