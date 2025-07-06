import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginForm = ({ onSubmit, onForgotPassword, isLoading = false }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { email, password } = formData;
    setIsFormValid(email.trim() && password.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [formData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFormValid) return;
    // Call the onSubmit prop and handle any errors it might throw
    Promise.resolve(onSubmit?.(formData)).catch(err => {
      console.error('Login failed in form:', err);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col" noValidate action="#" method="POST">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1 relative">
            <FiMail className="absolute left-3 top-2.5 text-gray-400" />
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={formData.email} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <button type="button" onClick={onForgotPassword} className="text-sm text-gray-600 hover:underline cursor-pointer">Forgot password?</button>
          </div>
          <div className="mt-1 relative">
            <FiLock className="absolute left-3 top-2.5 text-gray-400" />
            <input
              id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
              value={formData.password} onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit" disabled={!isFormValid || isLoading}
        className={`w-full py-2 px-4 text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
          !isFormValid || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer'
        }`}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;
