// src/pages/Found/FoundPending.jsx
import FoundList from './FoundList'
import { useState, useEffect } from 'react'
import { FiClock } from 'react-icons/fi'
import CategoryFilter, { categories } from '../../components/CategoryFilter'

const FoundPending = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <FiClock className="w-6 h-6 text-gray-700" />
                Pending Items
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Items awaiting verification and resolution
              </p>
            </div>
            
            {/* Category Filter Dropdown */}
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          {/* Divider */}
          <div className="mt-6 border-t border-gray-200"></div>
        </div>
        
        {/* Main Content */}
        <FoundList filter="Pending" selectedCategory={selectedCategory} />

        
        {/* Empty State (handled by FoundList) */}
        
        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoundPending
