import { useEffect, useState } from 'react'
import axios from '../../lib/axios'
import FoundCard from '../../features/found/FoundCard'
import LoadingSpinner from '../../shared/LoadingSpinner'
import EmptyState from '../../shared/EmptyState'
import useAuthStore from '../../store/useAuthStore'

const categories = [
  'All Categories',
  'Electronics',
  'Documents & ID',
  'Clothing & Accessories',
  'Stationery & Books',
  'Keys & Cards',
  'Jewelry & Valuables',
  'Miscellaneous',
]

const FoundList = ({ filter }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const endpoint = filter === 'Mine' ? '/found-items/personal' : '/found-items'
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })

        let data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
            ? res.data.items
            : []

        // Apply status filter
        if (filter === 'Pending' || filter === 'Resolved') {
          data = data.filter((item) => item.status === filter)
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
          data = data.filter((item) => item.categoryTag === selectedCategory)
        }

        // Sort by latest foundDate
        data.sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate))

        setItems(data)
      } catch (err) {
        console.error('Failed to fetch found items:', err.response?.data || err.message)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [filter, token, selectedCategory])

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id))
  }

  return (
    <div className="p-4 space-y-4">
      {/* 🔽 Category Filter Dropdown */}
      <div className="flex justify-end">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 Content Area */}
      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="No found items to display." />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoundCard
              key={item._id}
              item={item}
              onDelete={handleDelete}
              showDelete={filter === 'Mine'}
              showClaims={filter === 'Mine'}
              filter={filter}
            />

          ))}
        </div>
      )}
    </div>
  )
}

export default FoundList
