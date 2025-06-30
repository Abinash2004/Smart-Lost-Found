import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const Navbar = () => {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Smart Lost & Found
      </Link>

      <div className="space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{user?.fullName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
