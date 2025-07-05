
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import RegisterOtpVerify from '../pages/RegisterOtpVerify'
import LoginOtpVerify from '../pages/LoginOtpVerify'
import FoundPost from '../pages/FoundPost'
import FoundPending from '../pages/FoundPending'
import FoundResolved from '../pages/FoundResolved'
import MyFoundPosts from '../pages/MyFoundPosts'
import ClaimPost from '../pages/ClaimPost'
import ViewClaims from '../pages/ViewClaims'
import MyClaims from '../pages/MyClaims'
import HomeRedirect from '../pages/HomeRedirect'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-register" element={<RegisterOtpVerify />} />
      <Route path="/verify-login" element={<LoginOtpVerify />} />
      <Route path="/found/post" element={<FoundPost />} />
      <Route path="/found/pending" element={<FoundPending />} />
      <Route path="/found/resolved" element={<FoundResolved />} />
      <Route path="/found/mine" element={<MyFoundPosts />} />
      <Route path="/claim/:foundItemId" element={<ClaimPost />} />
      <Route path="/found/:foundItemId/claims" element={<ViewClaims />} />
      <Route path="/claims/mine" element={<MyClaims />} />

    </Routes>
  )
}

export default AppRoutes
