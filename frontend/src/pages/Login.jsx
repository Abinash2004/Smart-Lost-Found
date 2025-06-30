import axios from '../lib/axios'
import LoginForm from '../features/auth/LoginForm'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = async ({ email, password }) => {
    try {
      await axios.post('/auth/send-login-otp', { email, password })
      navigate('/verify-login', { state: { email } })
    } catch (err) {
      console.error('Login OTP send failed:', err.response?.data || err.message)
      alert('Invalid credentials or failed to send OTP.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}

export default Login
