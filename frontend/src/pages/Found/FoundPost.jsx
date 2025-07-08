import axios from '../../lib/axios'
import { useNavigate } from 'react-router-dom'
import FoundForm from '../../features/found/FoundForm'
import useAuthStore from '../../store/useAuthStore'

const FoundPost = () => {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  const handleSubmit = async (data) => {
    try {
      const res = await axios.post('/found-items', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert('Item posted successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to post item:', err.response?.data || err.message)
      alert('Error posting item.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="px-6 py-5 bg-neutral-900 border-b border-neutral-800">
            <h1 className="text-2xl font-semibold text-neutral-100">Report Found Item</h1>
            <p className="mt-1 text-sm text-neutral-400">Help reunite lost items with their owners</p>
          </div>
          <FoundForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default FoundPost
