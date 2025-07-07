import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import axios from '../../lib/axios'
import StatusBadge from '../../shared/StatusBadge'

const ClaimDetails = () => {
  const { claimId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [claim, setClaim] = useState(location.state?.claim || null)
  const [foundItem, setFoundItem] = useState(null)
  const [loading, setLoading] = useState(!location.state?.claim)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFoundItem = async () => {
      if (!claim?.foundItemId) return
      try {
        const response = await axios.get(`/found-items/${claim.foundItemId}`)
        setFoundItem(response.data)
      } catch (err) {
        console.error('Error fetching found item:', err)
      }
    }

    if (claim) {
      if (claim.foundItemId) fetchFoundItem()
    } else {
      const fetchClaim = async () => {
        try {
          const res = await axios.get(`/claims/${claimId}`)
          setClaim(res.data)
        } catch (err) {
          setError('Failed to load claim')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchClaim()
    }
  }, [claim, claimId])

  if (loading) return <div className="p-4">Loading...</div>
  // Check if user is admin (you may want to implement proper auth check)
  const isAdmin = true; // Replace with actual admin check

  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!claim) return <div className="p-4">Claim not found</div>

  const {
    fullName,
    contactNumber,
    description,
    additionalInfo,
    imageProof,
    status,
    rejectionFeedback,
    createdAt,
  } = claim

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this claim?')) return;
    
    setProcessing(true);
    try {
      await axios.patch(`/claim-items/approve/${claimId}`);
      setClaim(prev => ({ ...prev, status: 'Approved' }));
      alert('Claim approved successfully');
    } catch (err) {
      console.error('Error approving claim:', err);
      alert('Failed to approve claim');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    let reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User clicked cancel
    if (!reason.trim()) {
      alert('Rejection reason cannot be empty');
      return;
    }
    
    setProcessing(true);
    try {
      await axios.patch(`/claim-items/reject/${claimId}`, { rejectionFeedback: reason });
      setClaim(prev => ({ ...prev, status: 'Rejected', rejectionFeedback: reason }));
      alert('Claim rejected successfully');
    } catch (err) {
      console.error('Error rejecting claim:', err);
      alert('Failed to reject claim');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Claims
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Claim Details</h1>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submitted on {format(new Date(createdAt), 'dd MMM yyyy, hh:mm a')}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0">
                <div className="scale-110">
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Top Section: Claimant and Item Information */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Left Column */}
              <div className="flex-1 flex flex-col">
                {/* Claimant Information */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Claimant Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="mt-1 text-gray-900">{fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                        <p className="mt-1 text-gray-900">{contactNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Button - Always visible */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mt-auto">
                  <button
                    onClick={() => imageProof && window.open(imageProof, '_blank')}
                    disabled={!imageProof}
                    className={`w-full py-3 px-4 border rounded-md shadow-sm text-sm font-medium flex items-center justify-center space-x-2 cursor-pointer ${
                      imageProof 
                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500' 
                        : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    {imageProof ? (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>View Image Proof</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Image Proof Not Available</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column - Item Information */}
              <div className="flex-1">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 h-full">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Item Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Item Name</p>
                        <p className="mt-1 text-gray-900">{foundItem?.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Found Date</p>
                        <p className="mt-1 text-gray-900">
                          {foundItem?.foundDate ? format(new Date(foundItem.foundDate), 'dd MMM yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Found By</p>
                        <p className="mt-1 text-gray-900">{foundItem?.foundByName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact</p>
                        <p className="mt-1 text-gray-900">{foundItem?.foundByContact || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Found Location</p>
                      <p className="mt-1 text-gray-900">{foundItem?.foundLocation || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Divider */}
            <div className="border-t border-gray-200 my-8 w-full"></div>

            {/* Bottom Section: Description and Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{description || 'No description provided'}</p>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {additionalInfo || 'No additional information provided'}
                </p>
              </div>
            </div>

            {/* Rejection Feedback */}
            {status === 'Rejected' && rejectionFeedback && (
              <div className="mt-8">
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-gray-400">
                  <div className="flex">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-900">Rejection Feedback</h3>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{rejectionFeedback}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isAdmin && status === 'Pending' && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve Claim</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject Claim</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimDetails
