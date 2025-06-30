import { Routes, Route } from 'react-router-dom'
import Register from '../pages/Register'
import RegisterOtpVerify from '../pages/RegisterOtpVerify'
import Login from '../pages/Login'
import LoginOtpVerify from '../pages/LoginOtpVerify'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/verify-register" element={<RegisterOtpVerify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-login" element={<LoginOtpVerify />} />
    </Routes>
  )
}

export default AppRoutes
