import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../lib/axios';
import { FiLock, FiCheckCircle, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { email, resetToken } = location.state || {};
  const isFormValid = formData.newPassword === formData.confirmPassword && 
                     formData.newPassword.length >= 6 && 
                     formData.confirmPassword.length >= 6;

  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/forgot-password');
    }
  }, [email, resetToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setError('');
      
      await axios.post('/auth/update-password', {
        email,
        resetToken,
        newPassword: formData.newPassword
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password updated successfully. Please login with your new password.' 
          } 
        });
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, resetToken, formData.newPassword, isFormValid, navigate]);

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-center max-w-sm">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <FiCheckCircle className="h-8 w-8 text-gray-800" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Password Updated</h3>
          <p className="text-gray-600 mb-6">
            Your password has been updated successfully. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const renderInput = (name, label, showField) => (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          name={name}
          type={showField ? 'text' : 'password'}
          value={formData[name]}
          onChange={handleChange}
          placeholder={label}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400"
          disabled={isLoading}
          required
        />
        <button
          type="button"
          onClick={() => togglePassword(name === 'newPassword' ? 'new' : 'confirm')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          tabIndex="-1"
        >
          {showField ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
      {name === 'newPassword' && touched.newPassword && formData.newPassword.length > 0 && formData.newPassword.length < 6 && (
        <p className="text-sm text-gray-500">Password must be at least 6 characters</p>
      )}
      {name === 'confirmPassword' && touched.confirmPassword && formData.newPassword !== formData.confirmPassword && (
        <p className="text-sm text-red-500">Passwords do not match</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter and confirm your new password below
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderInput('newPassword', 'Create new password', showPassword.new)}
            {renderInput('confirmPassword', 'Confirm your password', showPassword.confirm)}
            
            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !isFormValid || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer'
                }`}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              Back to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
