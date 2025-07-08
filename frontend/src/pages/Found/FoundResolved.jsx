// src/pages/Found/FoundResolved.jsx
import FoundList from './FoundList'
import { useState, useEffect } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import CategoryFilter from '../../components/CategoryFilter'

const FoundResolved = () => {
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
    <div className="min-h-screen bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                <FiCheckCircle className="w-6 h-6 text-green-500" />
                Resolved Items
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                Successfully resolved and returned items
              </p>
            </div>
            
            {/* Category Filter Dropdown */}
            <div className="w-full sm:w-auto">
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
          
          {/* Divider */}
          <div className="mt-6 border-t border-neutral-800"></div>
        </div>
        
        {/* Main Content */}
        <FoundList filter="Resolved" selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}

export default FoundResolved
