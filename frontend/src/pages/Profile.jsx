import { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiSave, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 relative">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 relative">
              <FiUser className="h-12 w-12 text-blue-500" />
              {isSuccess && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <FiCheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {formData.fullName || 'Profile'}
            </h1>
            {isSuccess && (
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <FiCheckCircle className="mr-1" />
                Profile updated successfully
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Contact Number Field */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.contactNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="1234567890"
                />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!hasChanges() || !isFormValid() || isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !hasChanges() || !isFormValid() || isSubmitting
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="-ml-1 mr-2 h-5 w-5" />
                    {hasChanges() ? 'Save Changes' : 'No Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
