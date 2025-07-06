import ClaimForm from '../../features/claim/ClaimForm'

const ClaimPost = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 bg-gray-100 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Submit Claim</h1>
            <p className="mt-1 text-sm text-gray-500">Provide details to claim this found item</p>
          </div>
          <ClaimForm />
        </div>
      </div>
    </div>
  )
}

export default ClaimPost
