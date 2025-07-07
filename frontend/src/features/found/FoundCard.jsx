import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiTag, 
  FiPlus, 
  FiEye, 
  FiTrash2,
  FiCheck,
  FiClock,
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
        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 cursor-pointer transform hover:-translate-y-0.5"
        aria-label="Claim this item"
      >
        <FiPlus className="w-3.5 h-3.5" />
        <span>Claim Item</span>
      </button>
    )
    if (hasClaimed && isPending) return (
      <button 
        disabled 
        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg bg-white text-gray-500 border border-gray-200 cursor-not-allowed focus:outline-none"
        aria-label="Claim request already submitted"
      >
        <FiCheck className="w-3.5 h-3.5" />
        <span>Requested</span>
      </button>
    )
    return null
  }

  return (
    <div className="group bg-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01]">
      <div className="p-6 pb-4 flex-grow group-hover:bg-gray-200 transition-colors duration-300">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">{item.title}</h3>
            <StatusBadge status={item.status} className="shrink-0" />
          </div>

          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                <FiMapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-gray-700">{item.foundLocation}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                <FiCalendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-gray-700">{format(new Date(item.foundDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                <FiUser className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-gray-700">Found by <span className="font-medium text-gray-900">{item.foundByName}</span></span>
            </div>
            
            {item.categoryTag && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                  <FiTag className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                </div>
                <StatusBadge 
                  status={item.categoryTag} 
                  category={true} 
                  className="!bg-white !border !border-gray-200 !shadow-none !text-gray-700 hover:!text-gray-900" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 group-hover:bg-gray-100 transition-colors duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              <span>Posted {format(new Date(item.createdAt || new Date()), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              {renderButton()}
              {canDelete && (
                <button 
                  onClick={handleDelete}
                  className="p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 flex items-center justify-center h-[34px] w-[34px] cursor-pointer"
                  aria-label="Delete this item"
                  title="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              )}
              {showClaims && (
                <button 
                  onClick={() => navigate(`/found/${item._id}/claims`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 cursor-pointer"
                  aria-label="View claims for this item"
                >
                  <FiEye className="w-3.5 h-3.5" />
                  <span>View Claims</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
  )
})

export default React.memo(FoundCard)
