import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../lib/axios'
import OtpInput from '../features/auth/OtpInput'
import useAuthStore from '../store/useAuthStore'

const LoginOtpVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const isOtpComplete = otp.every((digit) => digit !== '')
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e) => {
    if (!isOtpComplete || !email) return

    const otpCode = otp.join('').trim()
    setLoading(true)

    try {
      const res = await axios.post('/auth/verify-login-otp', {
        email,
        otp: otpCode,
      })

      const { token, user } = res.data
      setAuth({ token, user })
      navigate('/dashboard')
    } catch (err) {
      console.error('Login OTP failed:', err.response?.data || err.message)
      alert('Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OtpInput
      otp={otp}
      setOtp={setOtp}
      title="Verify Login"
      buttonText="Verify & Continue"
      loading={loading}
      onSubmit={handleSubmit}
      isOtpComplete={isOtpComplete}
    />
  )
}

export default LoginOtpVerify
