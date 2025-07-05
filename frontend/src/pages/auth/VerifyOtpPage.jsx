import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import OtpInput from '../../features/auth/OtpInput';
import useAuthStore from '../../store/useAuthStore';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  // Determine if this is a password reset flow
  const isPasswordReset = location.pathname === '/verify-reset-otp';

  // Set up component based on flow type
  useEffect(() => {
    if (isPasswordReset) {
      // For password reset flow
      if (location.state?.email) {
        setEmail(location.state.email);
        localStorage.setItem('otpEmail', location.state.email);
      } else {
        const savedEmail = localStorage.getItem('otpEmail');
        if (savedEmail) {
          setEmail(savedEmail);
        } else {
          navigate('/forgot-password');
        }
      }
    } else {
      // For registration flow
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

  const handleOtpSubmit = async (e, err) => {
    if (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const otpString = otp.join('');

      if (isPasswordReset) {
        // Handle password reset OTP verification
        const response = await axios.post('/auth/verify-password-otp', {
          email,
          otp: otpString,
        });

        const { resetToken } = response.data;
        navigate('/update-password', {
          state: { email, resetToken },
        });
      } else {
        // Handle registration OTP verification
        const response = await axios.post('/auth/verify-register-otp', {
          ...formData,
          otp: otpString,
        });

        const { token, user } = response.data;
        setAuth({ token, user });
        
        // Clear temp data
        localStorage.removeItem('otpFormData');
        localStorage.removeItem('otpEmail');
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const endpoint = isPasswordReset 
        ? '/auth/send-password-otp' 
        : '/auth/send-register-otp';
      
      const data = isPasswordReset ? { email } : formData;
      
      await axios.post(endpoint, data);
      
      alert('A new OTP has been sent to your email.');
    } catch (err) {
      console.error('Failed to resend OTP:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // UI text based on flow type
  const title = isPasswordReset ? 'Verify Your Identity' : 'Verify Your Email';
  const description = isPasswordReset 
    ? `Enter the 6-digit verification code sent to ${email}`
    : `We've sent a 6-digit verification code to ${email}`;
  const buttonText = isPasswordReset 
    ? 'Continue to Reset Password' 
    : 'Verify & Continue';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <OtpInput
            otp={otp}
            setOtp={setOtp}
            title="Enter Verification Code"
            buttonText={buttonText}
            loading={isLoading}
            onSubmit={handleOtpSubmit}
            isOtpComplete={otp.every(digit => digit !== '')}
            email={email}
            isPasswordReset={isPasswordReset}
          />

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
