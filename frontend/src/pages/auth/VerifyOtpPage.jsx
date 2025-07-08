import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import OtpInput from '../../features/auth/OtpInput';
import useAuthStore from '../../store/useAuthStore';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const isPasswordReset = location.pathname === '/verify-reset-otp';
  const isOtpComplete = otp.every(digit => digit !== '');
  
  // UI text based on flow type
  const title = isPasswordReset ? 'Verify Your Identity' : 'Verify Your Email';
  const description = isPasswordReset 
    ? `Enter the 6-digit verification code sent to ${email}`
    : `We've sent a 6-digit verification code to ${email}`;
  const buttonText = isPasswordReset ? 'Continue to Reset' : 'Verify & Continue';
  const msgClass = 'mb-6 p-3 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-neutral-200';
  const btnClass = `w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
    !isOtpComplete || isLoading ? 'bg-neutral-800 cursor-not-allowed text-neutral-500' : 'bg-neutral-800 hover:bg-neutral-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1'}`;

  // Set up component based on flow type
  useEffect(() => {
    if (isPasswordReset) {
      if (location.state?.email) {
        const { email } = location.state;
        setEmail(email);
        localStorage.setItem('otpEmail', email);
      } else {
        const savedEmail = localStorage.getItem('otpEmail');
        savedEmail ? setEmail(savedEmail) : navigate('/forgot-password');
      }
    } else {
      const savedFormData = localStorage.getItem('otpFormData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        setEmail(parsedData.email || '');
      } else {
        navigate('/register');
      }
    }
  }, [isPasswordReset, location.state, navigate]);

  const handleOtpSubmit = useCallback(async (e, err) => {
    if (err) return setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    if (!isOtpComplete) return;

    try {
      setIsLoading(true);
      setError('');
      const otpString = otp.join('');

      if (isPasswordReset) {
        const { data } = await axios.post('/auth/verify-password-otp', { email, otp: otpString });
        navigate('/update-password', { state: { email, resetToken: data.resetToken } });
      } else {
        const { data } = await axios.post('/auth/verify-register-otp', { ...formData, otp: otpString });
        setAuth({ token: data.token, user: data.user });
        localStorage.removeItem('otpFormData');
        localStorage.removeItem('otpEmail');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
      console.error('OTP verification failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, formData, isPasswordReset, isOtpComplete, navigate, setAuth]);

  const handleResendOtp = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const endpoint = isPasswordReset ? '/auth/send-password-otp' : '/auth/send-register-otp';
      await axios.post(endpoint, isPasswordReset ? { email } : formData);
      alert('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      console.error('Failed to resend OTP:', err);
    } finally {
      setIsLoading(false);
    }
  }, [email, formData, isPasswordReset]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-neutral-100">{title}</h2>
        <p className="mt-2 text-center text-sm text-neutral-400">{description}</p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md bg-neutral-900 py-8 px-6 shadow-lg rounded-lg sm:px-10 border border-neutral-800">
        {error && <div className={msgClass}>{error}</div>}
        <OtpInput
          otp={otp}
          setOtp={setOtp}
          title={title}
          buttonText={buttonText}
          loading={isLoading}
          onSubmit={handleOtpSubmit}
          isOtpComplete={isOtpComplete}
          email={email}
          isPasswordReset={isPasswordReset}
        />

        <div className="mt-6 text-center text-sm">
          <p className="text-sm text-neutral-500">Didn't receive a code? <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-neutral-300 hover:text-white font-medium focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1 rounded px-2 py-1 -ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Resend OTP</button></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
