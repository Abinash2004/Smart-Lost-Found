import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiBriefcase, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    designation: '',
    contactNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow numbers and limit to 10 digits
    if (name === 'contactNumber') {
      if (value === '' || /^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (errors.contactNumber) {
          setErrors({ ...errors, contactNumber: '' });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(formData.contactNumber)) {
      setErrors({
        ...errors,
        contactNumber: 'Please enter a valid 10-digit phone number',
      });
      return;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      setErrors({
        ...errors,
        terms: 'You must accept the Terms & Conditions to continue'
      });
      return;
    }
    
    // Clear any existing errors
    setErrors({});
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiUser className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Email Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiMail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Password Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full pl-10 pr-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          tabIndex="-1"
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5" />
          ) : (
            <FiEye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Designation Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiBriefcase className="h-5 w-5 text-gray-400" />
        </div>
        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          required
          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          disabled={isLoading}
        >
          <option value="">Select Designation</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Contact Number Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiPhone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="contactNumber"
          type="tel"
          placeholder="Contact Number"
          required
          value={formData.contactNumber}
          onChange={handleChange}
          className={`w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.contactNumber ? 'border-red-500' : ''
          }`}
          disabled={isLoading}
          maxLength={10}
          inputMode="numeric"
          pattern="\d{10}"
        />
        {errors.contactNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
        )}
      </div>

      {/* Terms & Conditions and Privacy Policy Checkbox */}
      <div className="flex items-start mt-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (errors.terms) {
                setErrors({ ...errors, terms: '' });
              }
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the{' '}
            <Link 
              to="/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
            >
              Terms & Conditions <FiExternalLink className="ml-1 h-3 w-3" />
            </Link>{' '}
            and{' '}
            <Link 
              to="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
            >
              Privacy Policy <FiExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex justify-center items-center ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </button>
    </form>
  )
}

export default RegisterForm
