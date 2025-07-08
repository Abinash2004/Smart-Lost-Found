import { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiSave, FiLoader, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import useAuthStore from '../store/useAuthStore';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const initialFormData = useRef(null);
  const { setAuth, user: currentUser } = useAuthStore();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('/users/me');
        const userData = {
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          contactNumber: data.user.contactNumber || '',
        };
        setFormData(userData);
        // Store initial form data to track changes
        initialFormData.current = userData;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to load profile data';
        toast.error(errorMessage);
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      const { data } = await axios.put('/users/profile', {
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
      });
      
      // Update initial form data with new values
      const updatedUser = {
        ...currentUser,
        fullName: data.user.fullName,
        contactNumber: data.user.contactNumber,
      };
      
      // Update auth store with new user data
      setAuth({
        token: localStorage.getItem('token'),
        user: updatedUser
      });
      
      // Update local state
      initialFormData.current = {
        fullName: data.user.fullName,
        email: data.user.email,
        contactNumber: data.user.contactNumber,
      };
      
      // Show success message
      setIsSuccess(true);
      toast.success('Profile updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!initialFormData.current) return false;
    return (
      formData.fullName !== initialFormData.current.fullName ||
      formData.contactNumber !== initialFormData.current.contactNumber
    );
  };
  
  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.fullName && 
      formData.contactNumber && 
      /^[0-9]{10,15}$/.test(formData.contactNumber)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <FiArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden transition-all duration-200 hover:shadow-neutral-900/20">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="h-20 w-20 rounded-full bg-neutral-300 flex items-center justify-center text-black text-2xl font-medium">
                  {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                  {isSuccess && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-sm">
                      <FiCheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {formData.fullName || 'Profile'}
              </h1>
              <p className="text-sm text-neutral-400">Update your personal information</p>
              
              {isSuccess && (
                <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <FiCheckCircle className="mr-1.5 h-4 w-4" />
                  Profile updated successfully
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-neutral-800 border ${
                        errors.fullName 
                          ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                          : 'border-neutral-700 focus:ring-neutral-400 focus:border-neutral-400'
                      } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 text-neutral-100 placeholder-neutral-500`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="block w-full pl-10 pr-3 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-md text-neutral-300 sm:text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Contact Number Field */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-neutral-300 mb-1">
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-neutral-800 border ${
                        errors.contactNumber 
                          ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                          : 'border-neutral-700 focus:ring-neutral-400 focus:border-neutral-400'
                      } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 text-neutral-100 placeholder-neutral-500`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.contactNumber}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!hasChanges() || !isFormValid() || isSubmitting}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
                    !hasChanges() || !isFormValid() || isSubmitting
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 focus:ring-offset-neutral-900'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FiSave className="-ml-1 mr-2 h-4 w-4" />
                      {hasChanges() ? 'Save Changes' : 'No Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
