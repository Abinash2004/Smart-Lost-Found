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
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-100 text-center">Create an Account</h1>
        
        {error && (
          <div className="mt-6 bg-neutral-900 border border-neutral-800 text-neutral-200 px-4 py-3 rounded-md shadow-sm flex items-start" role="alert">
            <svg className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm ml-3">{error}</p>
          </div>
        )}
        
        <div className="mt-8 bg-neutral-900 py-8 px-6 shadow-lg rounded-lg sm:px-10 border border-neutral-800">
          <div className="max-w-2xl mx-auto">
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          </div>
          
          <p className="mt-8 text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-neutral-300 hover:text-white hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
