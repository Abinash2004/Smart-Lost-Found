import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import StatusBadge from '../../shared/StatusBadge'
import useAuthStore from '../../store/useAuthStore'
import axios from '../../lib/axios'
import { useNavigate } from 'react-router-dom'

const FoundCard = ({ item, onDelete, showDelete, showClaims, filter }) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [hasClaimed, setHasClaimed] = useState(false)

  const isPending = item.status === 'Pending'
  const canDelete = showDelete && isPending
  const canClaim = isPending && filter === 'Pending' && 
                  user?.contactNumber !== item.foundByContact && 
                  !hasClaimed

  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const { data } = await axios.get(`claim-items/found/${item._id}`)
        setHasClaimed(data.claims?.some(c => c.contactNumber === user?.contactNumber))
      } catch (err) {
        console.error('Error checking claim status:', err)
      }
    }
    item._id && user?.contactNumber && checkClaimStatus()
  }, [item._id, user?.contactNumber])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/found-items/${item._id}`)
        onDelete?.(item._id)
      } catch (err) {
        console.error('Failed to delete:', err)
        alert('Failed to delete item.')
      }
    }
  }

  const renderButton = () => {
    if (canClaim) return (
      <button onClick={() => navigate(`/claim/${item._id}`)}
        className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
        Claim
      </button>
    )
    if (hasClaimed && isPending) return (
      <button disabled title="Only one request allowed per item"
        className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed">
        Requested
      </button>
    )
    return null
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2 relative">
      <StatusBadge status={item.status} className="absolute top-2 right-2" />
      
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-700">{item.categoryTag}</p>
      <p className="text-sm text-gray-600">📍 {item.foundLocation}</p>
      <p className="text-sm text-gray-600">📅 {format(new Date(item.foundDate), 'MMM d, yyyy')}</p>
      
      <div className="text-xs text-gray-500">
        Found by: <span className="font-medium">{item.foundByName}</span>
      </div>

      {item.status === 'Resolved' && item.returnedTo && item.returnedDate && (
        <div className="text-xs text-green-600 mt-2">
          ✅ Returned to <strong>{item.returnedTo}</strong> on{' '}
          <strong>{format(new Date(item.returnedDate), 'MMM d, yyyy')}</strong>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-3">
        {renderButton()}
        {showClaims && (
          <button onClick={() => navigate(`/found/claims/${item._id}`)}
            className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200">
            View Claims
          </button>
        )}
        {canDelete && (
          <button onClick={handleDelete}
            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default FoundCard
