import { useState } from 'react';
import axios from '../../lib/axios';
import RegisterForm from '../../features/auth/RegisterForm';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (formData) => {
    try {
      setIsLoading(true);
      setError('');
      
      await axios.post('/auth/send-register-otp', formData);
      
      // Store form data temporarily for OTP verification step
      localStorage.setItem('otpFormData', JSON.stringify(formData));
      navigate('/verify-register');
      
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">Create an Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <RegisterForm 
            onSubmit={handleRegister} 
            isLoading={isLoading} 
          />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
