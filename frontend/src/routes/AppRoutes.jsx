
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import FoundPost from '../pages/Found/FoundPost';
import FoundPending from '../pages/Found/FoundPending';
import FoundResolved from '../pages/Found/FoundResolved';
import MyFoundPosts from '../pages/Found/MyFoundPosts';
import ClaimPost from '../pages/Claim/ClaimPost';
import ViewClaims from '../pages/Claim/ViewClaims';
import MyClaims from '../pages/Claim/MyClaims';
import ClaimDetails from '../pages/Claim/ClaimDetails';
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
