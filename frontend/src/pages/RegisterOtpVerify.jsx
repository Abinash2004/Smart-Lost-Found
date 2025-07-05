import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import OtpInput from '../features/auth/OtpInput'
import useAuthStore from '../store/useAuthStore'

const RegisterOtpVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const formData = JSON.parse(localStorage.getItem('otpFormData'))
  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleSubmit = async (e) => {
    if (!isOtpComplete || !formData?.email) return

    const otpCode = otp.join('').trim()
    setLoading(true)

    try {
      const res = await axios.post('/auth/verify-register-otp', {
        ...formData,
        otp: otpCode,
      })

      const { token, user } = res.data
      setAuth({ token, user })

      // Clear temp data
      localStorage.removeItem('otpFormData')
      localStorage.removeItem('otpEmail')

      navigate('/dashboard')
    } catch (err) {
      console.error('OTP verification failed:', err.response?.data || err.message)
      alert('Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OtpInput
      otp={otp}
      setOtp={setOtp}
      title="Verify Your Email"
      buttonText="Verify & Continue"
      loading={loading}
      onSubmit={handleSubmit}
      isOtpComplete={isOtpComplete}
    />
  )
}

export default RegisterOtpVerify
