import { format } from 'date-fns'

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
}

const ClaimCard = ({ claim, showFoundInfo = false, showActions = false, onApprove, onReject }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-1 relative">
      {/* Top-right status badge */}
      <span
        className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-medium ${getStatusColor(claim.status)}`}
      >
        {claim.status}
      </span>

      {/* Found item info for MyClaims */}
      {showFoundInfo && claim.foundItem && (
        <div className="mb-2 border-b pb-2">
          <p className="text-sm text-gray-600">
            <strong>Claimed Item:</strong> {claim.foundItem.title}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Location:</strong> {claim.foundItem.foundLocation}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Found On:</strong>{' '}
            {format(new Date(claim.foundItem.foundDate), 'dd MMM yyyy')}
          </p>
        </div>
      )}

      <p><strong>Name:</strong> {claim.fullName}</p>
      <p><strong>Contact:</strong> {claim.contactNumber}</p>
      <p><strong>Description:</strong> {claim.description}</p>
      <p><strong>Status:</strong> {claim.status}</p>
      <p><strong>Additional Info:</strong> {claim.additionalInfo || 'No Info'}</p>

      {claim.imageProof && (
        <div>
          <span className="font-medium">Image Proof:</span>
          <img
            src={claim.imageProof}
            alt="Proof"
            className="mt-1 max-w-xs rounded border"
          />
        </div>
      )}

      {claim.status === 'Rejected' && claim.rejectionFeedback && (
        <p className="text-sm text-red-600 font-medium">
          <strong>Rejection Feedback:</strong> {claim.rejectionFeedback}
        </p>
      )}

      <p className="text-sm text-gray-500">
        Submitted on {format(new Date(claim.createdAt), 'dd MMM yyyy, hh:mm a')}
      </p>

      {showActions && claim.status === 'Pending' && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onApprove(claim._id)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(claim._id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default ClaimCard