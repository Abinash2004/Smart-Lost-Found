import { useNavigate } from 'react-router-dom'
import { PlusCircle, FolderOpen, Inbox, Clock } from 'lucide-react'

const actions = [
  {
    label: 'Post Found Item',
    icon: PlusCircle,
    route: '/found/post'
  },
  {
    label: 'View My Posts',
    icon: FolderOpen,
    route: '/found/mine'
  },
  {
    label: 'View My Claims',
    icon: Inbox,
    route: '/claims/mine'
  },
  {
    label: 'Pending Items',
    icon: Clock,
    route: '/found/pending'
  }
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="mt-1 text-sm text-gray-500">Common tasks at your fingertips</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map(({ label, icon: Icon, route }) => (
          <button 
            key={label} 
            onClick={() => navigate(route)} 
            className="group flex flex-col items-center justify-center bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-gray-50 text-gray-800 group-hover:bg-gray-100 transition-colors duration-200 mb-3">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
