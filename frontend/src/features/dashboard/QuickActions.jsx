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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-100 mb-1">Quick Actions</h2>
        <p className="text-sm text-neutral-400">Common tasks at your fingertips</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map(({ label, icon: Icon, route }) => (
          <button 
            key={label} 
            onClick={() => navigate(route)} 
            className="group flex flex-col items-center justify-center bg-neutral-900 rounded-xl p-5 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
          >
            <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-200 group-hover:bg-neutral-700 transition-all duration-300 ease-in-out mb-3 group-hover:shadow-inner">
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-neutral-200 text-center leading-tight group-hover:text-white transition-colors duration-300">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
