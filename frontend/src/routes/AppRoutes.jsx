
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import FoundPost from '../pages/found/FoundPost';
import FoundPending from '../pages/found/FoundPending';
import FoundResolved from '../pages/found/FoundResolved';
import MyFoundPosts from '../pages/found/MyFoundPosts';
import ClaimPost from '../pages/claim/ClaimPost';
import ViewClaims from '../pages/claim/ViewClaims';
import MyClaims from '../pages/claim/MyClaims';
import ClaimDetails from '../pages/claim/ClaimDetails';
import NotificationsPage from '../pages/NotificationsPage';
import HomeRedirect from '../pages/HomeRedirect';
import ForgotPassword from '../pages/auth/ForgotPassword';
import UpdatePassword from '../pages/auth/UpdatePassword';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import Profile from '../pages/Profile';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-register" element={<VerifyOtpPage />} />
      <Route path="/found/post" element={<FoundPost />} />
      <Route path="/found/pending" element={<FoundPending />} />
      <Route path="/found/resolved" element={<FoundResolved />} />
      <Route path="/found/mine" element={<MyFoundPosts />} />
      <Route path="/claim/:foundItemId" element={<ClaimPost />} />
      <Route path="/found/:foundItemId/claims" element={<ViewClaims />} />
      <Route path="/claims/mine" element={<MyClaims />} />
      <Route path="/claims/:claimId" element={<ClaimDetails />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={ <Profile /> } />
      
      {/* Password Reset Flow */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyOtpPage />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      {/* Legal Pages */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}

export default AppRoutes
