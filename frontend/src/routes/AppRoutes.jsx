import { Routes, Route } from 'react-router-dom'
import Register from '../pages/Register'
import RegisterOtpVerify from '../pages/RegisterOtpVerify'
import Login from '../pages/Login'
import LoginOtpVerify from '../pages/LoginOtpVerify'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../shared/ProtectedRoute'
import HomeRedirect from '../pages/HomeRedirect'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-register" element={<RegisterOtpVerify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-login" element={<LoginOtpVerify />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
    </Routes>
  )
}

export default AppRoutes
