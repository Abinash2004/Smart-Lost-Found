// src/pages/HomeRedirect.jsx
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const HomeRedirect = () => {
  const token = useAuthStore((state) => state.token)

  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

export default HomeRedirect
