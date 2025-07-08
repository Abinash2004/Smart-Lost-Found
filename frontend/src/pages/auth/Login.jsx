import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import LoginForm from '../../features/auth/LoginForm';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });


  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async (formData) => {
    const { email, password } = formData;
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data?.token && res.data?.user) {
        setMessage({ text: 'Successfully Signed In', type: 'success' });
        setAuth({ token: res.data.token, user: res.data.user });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      console.error('Login failed:', errorMessage);
      setMessage({ text: errorMessage, type: 'error' });
      // Keep the error message for 1 second before clearing loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-neutral-100">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">Sign in to your account</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-neutral-800">
          {message.text && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-neutral-800 text-green-400' 
                : 'bg-neutral-800 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            onForgotPassword={() => navigate('/forgot-password')}
            className="cursor-pointer"
          />
          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-400">Don't have an account? </span>
            <Link to="/register" className="font-medium text-neutral-200 hover:text-white hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
