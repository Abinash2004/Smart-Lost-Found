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
    label: 'Pending Found Items',
    icon: Clock,
    route: '/found/pending'
  }
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {actions.map(({ label, icon: Icon, route }) => (
          <button key={label} onClick={() => navigate(route)} className="flex flex-col items-center bg-white shadow rounded-xl p-4 hover:shadow-md transition">
            <Icon className="w-6 h-6 mb-2 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
