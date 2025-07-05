import { useState } from 'react';
import axios from '../../lib/axios';
import LoginForm from '../../features/auth/LoginForm';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }) => {
    try {
      setIsLoading(true);
      setError('');
      
      const res = await axios.post('/auth/login', { email, password });
      
      if (res.data && res.data.token && res.data.user) {
        setAuth({ 
          token: res.data.token, 
          user: res.data.user 
        });
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
          />
          
          <div className="mt-4 text-center text-sm">
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
