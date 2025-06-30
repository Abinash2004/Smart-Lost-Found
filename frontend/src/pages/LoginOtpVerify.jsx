import axios from '../lib/axios'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import OtpInput from '../features/auth/OtpInput'

const LoginOtpVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpComplete) return
    const otpCode = otp.join('')

    try {
      const res = await axios.post('/auth/verify-login-otp', {
        email,
        otp: otpCode,
      })

      const { token } = res.data
      localStorage.setItem('token', token)

      navigate('/dashboard')
    } catch (err) {
      console.error('Login OTP failed:', err.response?.data || err.message)
      alert('Invalid or expired OTP.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Verify Login</h2>
        <OtpInput otp={otp} setOtp={setOtp} />
        <button
          type="submit"
          disabled={!isOtpComplete || loading}
          className={`w-full py-2 rounded text-white transition ${
            !isOtpComplete || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>
    </div>
  )
}

export default LoginOtpVerify
