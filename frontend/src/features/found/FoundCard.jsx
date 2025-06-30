import { format } from 'date-fns'
import StatusBadge from '../../shared/StatusBadge'
import useAuthStore from '../../store/useAuthStore'
import axios from '../../lib/axios'
import { useNavigate } from 'react-router-dom'

const FoundCard = ({ item, onDelete, showDelete, showClaims, filter }) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const canDelete = showDelete && item.status === 'Pending'
  const canClaim = filter === 'Pending' && user?.fullName !== item.foundByName

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (!confirm) return

    try {
      await axios.delete(`/found-items/${item._id}`)
      onDelete?.(item._id)
    } catch (err) {
      console.error('Failed to delete:', err)
      alert('Failed to delete item.')
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2 relative">
      {/* ✅ Status badge */}
      <div className="absolute top-2 right-2">
        <StatusBadge status={item.status} />
      </div>

      <h3 className="text-lg font-semibold">{item.title}</h3>

      <p className="text-sm text-gray-700">{item.categoryTag}</p>
      <p className="text-sm text-gray-600">📍 {item.foundLocation}</p>
      <p className="text-sm text-gray-600">
        📅 {format(new Date(item.foundDate), 'dd MMM yyyy')}
      </p>

      <div className="text-xs text-gray-500">
        Found by: <span className="font-medium">{item.foundByName}</span>
      </div>

      {/* ✅ If Resolved, show Returned To + Returned Date */}
      {item.status === 'Resolved' && item.returnedTo && item.returnedDate && (
        <div className="text-xs text-green-600 mt-2">
          ✅ Returned to <strong>{item.returnedTo}</strong> on{' '}
          <strong>{format(new Date(item.returnedDate), 'dd MMM yyyy')}</strong>
        </div>
      )}

      {/* 🟡 Buttons Section */}
      <div className="flex justify-end gap-2 mt-3">
        {canClaim && (
          <button
            onClick={() => navigate(`/claim/${item._id}`)}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Claim
          </button>
        )}

        {showClaims && (
          <button
            onClick={() => navigate(`/found/${item._id}/claims`)}
            className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
          >
            View Claims
          </button>
        )}

        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default FoundCard
