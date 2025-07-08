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
        className="flex items-center justify-center gap-1.5 h-[34px] px-3 text-sm font-medium rounded-md shadow-sm transition-all duration-200 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 cursor-pointer"
        aria-label="Claim this item"
      >
        <FiPlus className="w-3.5 h-3.5" />
        <span>Claim Item</span>
      </button>
    )
    if (hasClaimed && isPending) return (
      <button 
        disabled 
        className="flex items-center justify-center gap-1.5 h-[34px] px-3 text-sm font-medium rounded-md shadow-sm transition-all duration-200 bg-neutral-800 cursor-not-allowed text-neutral-500"
        aria-label="Claim request already submitted"
      >
        <FiCheck className="w-3.5 h-3.5" />
        <span>Requested</span>
      </button>
    )
    return null
  }

  return (
    <div className="group bg-neutral-900 rounded-xl border border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01]">
      <div className="p-6 pb-4 flex-grow group-hover:bg-neutral-800/50 transition-colors duration-300">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-xl font-semibold text-white line-clamp-2 leading-tight">{item.title}</h3>
            <StatusBadge status={item.status} className="shrink-0" />
          </div>

          <div className="space-y-3 text-neutral-300">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                <FiMapPin className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-neutral-200">{item.foundLocation}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                <FiCalendar className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-neutral-200">{format(new Date(item.foundDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                <FiUser className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-neutral-200">Found by <span className="font-medium text-white">{item.foundByName}</span></span>
            </div>
            
            {item.categoryTag && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                  <FiTag className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                </div>
                <StatusBadge 
                  status={item.categoryTag} 
                  category={true} 
                  className="!bg-neutral-700 !border !border-neutral-600 !shadow-none !text-neutral-200 hover:!text-white" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-700 group-hover:bg-neutral-800 transition-colors duration-300">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center text-sm text-neutral-400">
            <FiClock className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>Posted {format(new Date(item.createdAt || new Date()), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            {renderButton()}
            {canDelete && (
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm text-red-400 hover:text-red-300 hover:border-red-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-neutral-800 flex items-center justify-center h-[34px] w-[34px] cursor-pointer"
                aria-label="Delete this item"
                title="Delete"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {showClaims && (
              <button 
                onClick={() => navigate(`/found/${item._id}/claims`)}
                className="flex items-center justify-center gap-1.5 h-[34px] px-3 text-sm font-medium rounded-md shadow-sm transition-all duration-200 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 cursor-pointer"
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
