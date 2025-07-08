import { useEffect, useState } from 'react'
import axios from '../../lib/axios'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { format } from 'date-fns'

const ClaimForm = () => {
  const { user, token } = useAuthStore()
  const { foundItemId } = useParams()
  const navigate = useNavigate()

  const [foundItem, setFoundItem] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    additionalInfo: '',
    imageProof: null,
  })
  
  // Check if all required fields are filled
  const isFormValid = formData.description.trim() !== ''
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFoundItem = async () => {
      try {
        const res = await axios.get(`/found-items`)
        const item = res.data.find((i) => i._id === foundItemId)
        setFoundItem(item)
      } catch (err) {
        console.error('Failed to fetch found item:', err)
      }
    }
    fetchFoundItem()
  }, [foundItemId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageProof: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('fullName', user.fullName)
    form.append('contactNumber', user.contactNumber)
    form.append('description', formData.description)
    form.append('additionalInfo', formData.additionalInfo)
    form.append('itemProofImage', formData.imageProof)

    try {
      setLoading(true)
      await axios.post(`/claim-items/${foundItemId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Claim submitted successfully.')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to submit claim.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Found Item Info */}
        <div className="space-y-6">
          <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-800 space-y-3">
            <h3 className="text-lg font-semibold text-neutral-100">Found Item Info</h3>
            {foundItem ? (
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-100">{foundItem.title}</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-neutral-700 rounded-full text-xs font-medium text-neutral-200">
                    {foundItem.categoryTag}
                  </span>
                </div>
                <div className="flex items-start text-sm text-neutral-300">
                  <svg className="w-4 h-4 mt-0.5 mr-1.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{foundItem.foundLocation}</span>
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <svg className="w-4 h-4 mr-1.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Found on {format(new Date(foundItem.foundDate), 'MMM dd, yyyy')}
                </div>
                <p className="text-xs text-neutral-400 pt-1">
                  Found by: <span className="font-medium text-neutral-300">{foundItem.foundByName}</span>
                </p>
              </div>
            ) : (
              <p className="text-neutral-400">Loading found item details...</p>
            )}
          </div>
        </div>

        {/* Right Column - Your Information */}
        <div className="space-y-6">
          <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-100 mb-3">Your Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user.fullName}
                  disabled
                  className="w-full px-4 py-2.5 text-sm border border-neutral-600 rounded-lg bg-neutral-700/50 text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={user.contactNumber}
                  disabled
                  className="w-full px-4 py-2.5 text-sm border border-neutral-600 rounded-lg bg-neutral-700/50 text-neutral-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Additional Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
            Description of Claim <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe why you believe this is your item..."
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2.5 text-sm border border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 placeholder-neutral-500 bg-neutral-800 text-neutral-100"
          />
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-neutral-300 mb-1">
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Any other details that can help verify your claim..."
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 text-sm border border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 placeholder-neutral-500 bg-neutral-800 text-neutral-100"
          />
        </div>
      </div>

      {/* 📝 Claim Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Proof of Ownership (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-neutral-600 rounded-lg hover:border-neutral-500 transition-colors duration-200">
            <div className="space-y-3 text-center">
              {formData.imageProof ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-neutral-200 truncate max-w-xs">
                    {formData.imageProof.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Click to change or drag and drop
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-neutral-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-neutral-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-neutral-300 hover:text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-neutral-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 border border-neutral-600 rounded-lg text-sm font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium ${
              isFormValid && !loading
                ? 'bg-neutral-300 hover:bg-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-all duration-200 cursor-pointer'
                : 'bg-neutral-800 cursor-not-allowed text-neutral-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Claim'
            )}
          </button>
        </div>
      </form>
      <div className="border-t border-neutral-700 pt-4 mt-6">
        <p className="text-sm text-neutral-400 text-center">
          By submitting this claim, you agree to our{' '}
          <a 
            href="/terms" 
            className="font-medium text-neutral-300 hover:text-white hover:underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="/privacy" 
            className="font-medium text-neutral-300 hover:text-white hover:underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  )
}

export default ClaimForm
