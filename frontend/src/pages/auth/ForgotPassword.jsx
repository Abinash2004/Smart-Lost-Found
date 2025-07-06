import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import { FiMail } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const isDisabled = isLoading || !email.trim();
  const btnClass = `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
    isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'}`;
  const msgClass = 'mb-6 p-3 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address');
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      await axios.post('/auth/send-password-otp', { email });
      setMessage('OTP has been sent to your email. Please check your inbox.');
      navigate('/verify-reset-otp', { state: { email, isPasswordReset: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      console.error('Failed to send OTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your email to receive a password reset OTP</p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {error && <div className={msgClass}>{error}</div>}
          {message && <div className={msgClass}>{message}</div>}

          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button type="submit" disabled={isDisabled} className={btnClass}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <button
            onClick={() => navigate('/login')}
            className="w-full text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline focus:outline-none transition-colors duration-200 cursor-pointer mt-6"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
