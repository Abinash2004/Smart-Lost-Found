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

  const formFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      icon: <FiUser />,
      placeholder: 'Enter your full name'
    },
    {
      id: 'contactNumber',
      label: 'Contact Number',
      type: 'tel',
      icon: <FiPhone />,
      placeholder: 'Enter your contact number',
      maxLength: 10,
      inputMode: 'numeric',
      pattern: '\\d{10}'
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      icon: <FiMail />,
      placeholder: 'Enter your email',
      autoComplete: 'email'
    },
    {
      id: 'password',
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      icon: <FiLock />,
      placeholder: 'Enter your password',
      autoComplete: 'new-password',
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-300 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex="-1"
        >
          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      )
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full" noValidate>
      <div className="space-y-5 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-neutral-200">
                {field.label}
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2.5 text-neutral-400">
                  {field.icon}
                </span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-2.5 bg-neutral-800 border ${errors[field.id] ? 'border-red-400' : 'border-neutral-700'} text-neutral-100 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 sm:text-sm placeholder-neutral-500 transition-colors`}
                  {...(field.maxLength && { maxLength: field.maxLength })}
                  {...(field.inputMode && { inputMode: field.inputMode })}
                  {...(field.pattern && { pattern: field.pattern })}
                  {...(field.autoComplete && { autoComplete: field.autoComplete })}
                />
              </div>
              {errors[field.id] && (
                <p className="mt-1 text-xs text-red-400">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-neutral-200">
            Designation
          </label>
          <div className="mt-1 relative">
            <FiBriefcase className="absolute left-3 top-2.5 text-neutral-400" />
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className={`w-full py-2.5 pl-10 pr-8 border ${errors.designation ? 'border-red-400' : 'border-neutral-700'} rounded-md shadow-sm text-sm text-white bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={isLoading}
            >
              {['', 'Student', 'Staff'].map((opt) => (
                <option key={opt || 'select'} value={opt}>
                  {opt || 'Select Designation'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-start mt-1">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (errors.terms) {
                setErrors((prev) => ({ ...prev, terms: '' }));
              }
            }}
            className="h-4 w-4 text-neutral-400 rounded border-neutral-700 focus:ring-neutral-500 cursor-pointer"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-neutral-400">
            I agree to the{' '}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-200 hover:text-white hover:underline transition-colors"
            >
              Terms & Conditions <FiExternalLink className="ml-1 h-3 w-3 inline" />
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-200 hover:text-white hover:underline transition-colors"
            >
              Privacy Policy <FiExternalLink className="ml-1 h-3 w-3 inline" />
            </Link>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-400">{errors.terms}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !acceptedTerms}
        className={`w-full py-2.5 px-4 text-sm font-medium rounded-md shadow-sm transition-all duration-200 ${
          isLoading || !acceptedTerms
            ? 'bg-neutral-800 cursor-not-allowed text-neutral-500'
            : 'bg-neutral-300 hover:bg-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 cursor-pointer'
        }`}
      >
        {isLoading ? <LoadingSpinner /> : 'Send OTP'}
      </button>
    </form>
  );
};

export default RegisterForm;
