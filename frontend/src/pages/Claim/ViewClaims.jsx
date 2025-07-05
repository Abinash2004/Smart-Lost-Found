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
        const res = await axios.get(`/claim-items/found/${foundItemId}`)
        const rawClaims = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.claims)
            ? res.data.claims
            : []

        const sortedClaims = rawClaims.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setClaims(sortedClaims)
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

  if (loading) return <LoadingSpinner />

  const isOwner = true // Optional: Add ownership logic if needed

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Claims for Your Found Item</h2>
        {itemInfo && (
          <p className="text-gray-600 mt-1">
            <strong>Item:</strong> {itemInfo.title} |{' '}
            <strong>Date:</strong> {format(new Date(itemInfo.foundDate), 'dd MMM yyyy')}
          </p>
        )}
      </div>

      {claims.length === 0 ? (
        <EmptyState message="No claims were submitted for this item." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {claims.map((claim) => (
            <ClaimCard
              key={claim._id}
              claim={claim}
              showActions={isOwner}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewClaims
