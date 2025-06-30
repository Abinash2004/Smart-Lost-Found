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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">Submit Claim</h2>

      {/* 🔍 Found Item Details */}
      {foundItem ? (
        <div className="border rounded p-4 bg-gray-50 space-y-1">
          <h3 className="text-lg font-semibold">{foundItem.title}</h3>
          <p className="text-sm text-gray-700">{foundItem.categoryTag}</p>
          <p className="text-sm text-gray-600">📍 {foundItem.foundLocation}</p>
          <p className="text-sm text-gray-600">
            📅 {format(new Date(foundItem.foundDate), 'dd MMM yyyy')}
          </p>
          <p className="text-xs text-gray-500">
            Found by: <span className="font-medium">{foundItem.foundByName}</span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading found item details...</p>
      )}

      {/* 📝 Claim Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={user.fullName}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          value={user.contactNumber}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />

        <textarea
          name="description"
          placeholder="Describe your claim..."
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="additionalInfo"
          placeholder="Any additional info (optional)"
          value={formData.additionalInfo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  )
}

export default ClaimForm
