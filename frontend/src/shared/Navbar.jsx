import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import NotificationBell from './NotificationBell'
import UserProfile from './UserProfile'
import DarkModeToggle from './DarkModeToggle'

const Navbar = () => {
  const { token } = useAuthStore()

  return (
    <nav className="bg-white shadow-sm p-3 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        Smart Lost & Found
      </Link>

      <div className="flex items-center space-x-8">
        {token && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/found/post">Post Found</NavLink>
            <NavLink to="/found/pending">Pending</NavLink>
            <NavLink to="/found/resolved">Resolved</NavLink>
            <NavLink to="/found/mine">My Posts</NavLink>
            <NavLink to="/claims/mine">My Claims</NavLink>
          </>
        )}
      </div>

      <div className="flex items-center space-x-6">
        {token ? (
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <NotificationBell />
            <UserProfile />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Link 
              to="/login" 
              className="px-4 py-1.5 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

// Reusable NavLink component for consistent styling
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors"
  >
    {children}
  </Link>
)

export default Navbar
