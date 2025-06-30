import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()           // ✅ Zustand: clears token + user
    navigate('/login') // 🔁 Redirect to login
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Dashboard{user?.fullName ? `, ${user.fullName}` : ''}!
      </h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard
