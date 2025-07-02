import { format } from 'date-fns'

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-700'
    case 'Rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-yellow-100 text-yellow-700'
  }
}

const ClaimCard = ({ claim, showActions = false, onApprove, onReject }) => {
  const {
    fullName,
    contactNumber,
    description,
    additionalInfo,
    imageProof,
    status,
    rejectionFeedback,
    createdAt,
    foundItem,
    _id
  } = claim

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2 relative">
      {/* Status Tag */}
      <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-medium ${getStatusColor(status)}`}>
        {status}
      </span>

      {/* Found Item Info */}
      {foundItem && (
        <div className="mb-2 border-b pb-2 space-y-1 text-sm text-gray-600">
          <p><strong>Item Name:</strong> {foundItem.title}</p>
          <p><strong>Location:</strong> {foundItem.foundLocation}</p>
          <p><strong>Found Date:</strong> {format(new Date(foundItem.foundDate), 'dd MMM yyyy')}</p>
          <p><strong>Found By:</strong> {foundItem.foundByName}</p>
          <p><strong>Contact:</strong> {foundItem.foundByContact || 'Not available'}</p>
        </div>
      )}

      {/* Claim Info */}
      <p><strong>Name:</strong> {fullName}</p>
      <p><strong>Contact:</strong> {contactNumber}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Additional Info:</strong> {additionalInfo || 'No Info'}</p>

      {/* Image Proof */}
      {imageProof && (
        <div>
          <p className="font-medium">Image Proof:</p>
          <img
            src={imageProof}
            alt="Proof"
            className="mt-1 w-50 max-w-xs h-auto rounded border object-contain"
          />
        </div>
      )}

      {/* Rejection Feedback */}
      {status === 'Rejected' && rejectionFeedback && (
        <p className="text-sm text-red-600 font-medium">
          <strong>Rejection Feedback:</strong> {rejectionFeedback}
        </p>
      )}

      {/* Submission Date */}
      <p className="text-sm text-gray-500">
        Submitted on {format(new Date(createdAt), 'dd MMM yyyy, hh:mm a')}
      </p>

      {/* Approve / Reject Buttons */}
      {showActions && status === 'Pending' && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onApprove(_id)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(_id)}
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
