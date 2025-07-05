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
    <div className="min-h-screen bg-gray-100 py-10">
      <FoundForm onSubmit={handleSubmit} />
    </div>
  )
}

export default FoundPost
