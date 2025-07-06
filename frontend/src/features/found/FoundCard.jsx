import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiAlertCircle, 
  FiTag, 
  FiPlus, 
  FiEye, 
  FiTrash2,
  FiCheck,
  FiClock as FiClockIcon
} from 'react-icons/fi';
import StatusBadge from '../../shared/StatusBadge'
import useAuthStore from '../../store/useAuthStore'
import axios from '../../lib/axios'
import { useNavigate } from 'react-router-dom'

const FoundCard = React.memo(({ item, onDelete, showDelete, showClaims, filter }) => {
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
      <button
        onClick={() => navigate(`/claim/${item._id}`)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-150 cursor-pointer"
        aria-label="Claim this item"
      >
        <FiPlus className="w-3.5 h-3.5" />
        <span>Claim</span>
      </button>
    )
    if (hasClaimed && isPending) return (
      <button 
        disabled 
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
        aria-label="Claim request already submitted"
      >
        <FiCheck className="w-3.5 h-3.5" />
        <span>Requested</span>
      </button>
    )
    return null
  }

  return (
    <div className="card-hover bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 space-y-3 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
          <StatusBadge status={item.status} className="shrink-0" />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{item.foundLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{format(new Date(item.foundDate), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>Found by <span className="font-medium text-gray-800">{item.foundByName}</span></span>
          </div>
          
          {item.categoryTag && (
            <div className="flex items-center gap-2 pt-1">
              <FiTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <StatusBadge status={item.categoryTag} category={true} />
            </div>
          )}
        </div>

      {item.status === 'Resolved' && item.returnedTo && item.returnedDate && (
        <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 cursor-pointer">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Returned to <span className="font-medium">{item.returnedTo}</span> on {format(new Date(item.returnedDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      )}

      </div>
      
      <div className="mt-auto">
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-end gap-2">
            {renderButton()}
            {showClaims && (
              <button 
              onClick={() => navigate(`/found/${item._id}/claims`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ease-in-out bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500 cursor-pointer"
              aria-label="View claims for this item"
            >
              <FiEye className="w-3.5 h-3.5" />
              <span>View Claims</span>
            </button>
            )}
            {canDelete && (
              <button 
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ease-in-out bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 cursor-pointer"
              aria-label="Delete this item"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default React.memo(FoundCard)
