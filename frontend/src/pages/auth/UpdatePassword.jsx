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
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-6">
        <div className="text-center max-w-sm">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-neutral-900 mb-4">
            <FiCheckCircle className="h-8 w-8 text-neutral-200" />
          </div>
          <h3 className="text-xl font-medium text-neutral-100 mb-2">Password Updated</h3>
          <p className="text-neutral-400 mb-6">
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
          className={`w-full pl-10 pr-10 py-2.5 bg-neutral-800 border ${touched.newPassword && error ? 'border-red-400' : 'border-neutral-700'} text-neutral-100 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 sm:text-sm placeholder-neutral-500 transition-colors`}
          disabled={isLoading}
          required
        />
        <button
          type="button"
          onClick={() => togglePassword(name === 'newPassword' ? 'new' : 'confirm')}
          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1 rounded transition-colors"
          tabIndex="-1"
        >
          {showField ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
      {name === 'newPassword' && touched.newPassword && formData.newPassword.length > 0 && formData.newPassword.length < 6 && (
        <p className="text-sm text-neutral-400">Password must be at least 6 characters</p>
      )}
      {name === 'confirmPassword' && touched.confirmPassword && formData.newPassword !== formData.confirmPassword && (
        <p className="text-sm text-red-400">Passwords do not match</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-neutral-100">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Enter and confirm your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-neutral-900 border border-red-500/30 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">{error}</h3>
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
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
    !isFormValid || isLoading ? 'bg-neutral-800 cursor-not-allowed text-neutral-500' : 'bg-neutral-800 hover:bg-neutral-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1'}`}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full text-sm font-medium text-neutral-300 hover:text-white hover:underline focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1 rounded transition-colors cursor-pointer mt-6 px-2 py-1 -ml-2"
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
