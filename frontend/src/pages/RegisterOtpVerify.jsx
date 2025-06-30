import axios from '../lib/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import OtpInput from '../features/auth/OtpInput'
import { useState } from 'react'
import useAuthStore from '../store/useAuthStore'

const RegisterOtpVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)

  const formData = JSON.parse(localStorage.getItem('otpFormData'))
  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpComplete || !formData?.email) return

    const otpCode = otp.join('').trim()
    setLoading(true)

    try {
      const res = await axios.post('/auth/verify-register-otp', {
        ...formData,
        otp: otpCode,
      })

      const { token, user } = res.data
      setAuth({ token, user }) // ✅ Store in Zustand

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
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

export default RegisterOtpVerify
