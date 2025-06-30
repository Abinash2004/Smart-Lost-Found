import axios from '../lib/axios'
import RegisterForm from '../features/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const handleRegister = async (formData) => {
    try {
      await axios.post('/auth/send-register-otp', formData)
      navigate('/verify-register', { state: { email: formData.email } })
    } catch (err) {
      console.error('Send OTP failed:', err.response?.data || err.message)
      alert('Failed to send OTP. Please check your details.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  )
}

export default Register
