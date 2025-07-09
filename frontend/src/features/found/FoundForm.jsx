import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'
import {
  FiMonitor,
  FiFileText,
  FiKey,
  FiBox,
  FiMapPin,
  FiLoader,
  FiPlus,
  FiAward,
  FiBook,
} from 'react-icons/fi'

const categories = [
  { name: 'Electronics', icon: 'FiMonitor' },
  { name: 'Documents & ID', icon: 'FiFileText' },
  { name: 'Clothing & Accessories', icon: 'FiAward' },
  { name: 'Stationery & Books', icon: 'FiBook' },
  { name: 'Keys & Cards', icon: 'FiKey' },
  { name: 'Jewelry & Valuables', icon: 'FiAward' },
  { name: 'Miscellaneous', icon: 'FiBox' }
];

// Icon component map
const iconComponents = {
  FiMonitor,
  FiFileText,
  FiAward,
  FiBook,
  FiKey,
  FiBox
};


const FoundForm = ({ onSubmit }) => {
  const { user } = useAuthStore()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    categoryTag: '',
    images: []
  })
  
  // Check if all required fields are filled
  const isFormValid = formData.title.trim() !== '' && 
                    formData.description.trim() !== '' && 
                    formData.location.trim() !== '' && 
                    formData.categoryTag !== ''
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Please log in to post an item.')
    
    setIsSubmitting(true)
    
    try {
      const now = new Date()
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryTag: formData.categoryTag,
        foundLocation: formData.location.trim(),
        foundDate: now.toISOString(),
        foundByName: user.fullName,
        foundByContact: user.contactNumber,
        images: formData.images
      }

      await onSubmit(payload)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-1">
              Item Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Black Wallet, iPhone 13, etc."
              required
              className="w-full px-4 py-2.5 text-sm border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 placeholder-neutral-600 bg-neutral-800 text-neutral-100 focus:bg-neutral-800"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Category
            </label>
              <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setFormData({...formData, categoryTag: category.name})}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 text-center h-full cursor-pointer transform hover:scale-105 ${
                    formData.categoryTag === category.name 
                      ? 'border-neutral-500 bg-neutral-800 text-neutral-100 shadow-md' 
                      : 'border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 shadow-sm hover:shadow'}`}
                >
                  <span className="text-neutral-400 mb-1.5">
                    {(() => {
                      const IconComponent = iconComponents[category.icon] || FiBox;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                  </span>
                  <span className="text-xs font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the item..."
              required
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 placeholder-neutral-600 bg-neutral-800 text-neutral-100 focus:bg-neutral-800"
            />
          </div>

          {/* Found Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-300 mb-1">
              Found Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where did you find this item?"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 placeholder-neutral-600 bg-neutral-800 text-neutral-100 focus:bg-neutral-800"
              />
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-neutral-900 bg-neutral-300 hover:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-300 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-900" />
                  Posting...
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4 mr-2 text-neutral-900" />
                  Post Found Item
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-neutral-400">
          By posting, you agree to our{' '}
          <a href="/terms" className="font-medium text-neutral-300 hover:text-white hover:underline">
            Terms of Service
          </a>{' '}
          and {' '}
          <a href="/privacy" className="font-medium text-neutral-300 hover:text-white hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
  )
}

export default FoundForm
