import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'

const categories = [
  'Electronics',
  'Documents & ID',
  'Clothing & Accessories',
  'Stationery & Books',
  'Keys & Cards',
  'Jewelry & Valuables',
  'Miscellaneous'
]

const FoundForm = ({ onSubmit }) => {
  const { user } = useAuthStore()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    categoryTag: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return alert('Login required.')

    const now = new Date()
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryTag: formData.categoryTag,
      foundLocation: formData.location,
      foundDate: now.toISOString(), // ISO string to support `Date` type in backend
      foundByName: user.fullName,
      foundByContact: user.contactNumber,
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">Post a Found Item</h2>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Item Title"
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Item Description"
        required
        className="w-full p-2 border rounded"
        rows={4}
      />

      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Found Location"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="categoryTag"
        value={formData.categoryTag}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Post Item
      </button>
    </form>
  )
}

export default FoundForm
