import ClaimForm from '../../features/claim/ClaimForm'

const ClaimPost = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="px-6 py-5 bg-neutral-900 border-b border-neutral-800">
            <h1 className="text-2xl font-semibold text-neutral-100">Submit Claim</h1>
            <p className="mt-1 text-sm text-neutral-400">Provide details to claim this found item</p>
          </div>
          <ClaimForm />
        </div>
      </div>
    </div>
  )
}

export default ClaimPost
