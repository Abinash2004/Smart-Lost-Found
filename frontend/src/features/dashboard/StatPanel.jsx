import { CircleDollarSign, HandCoins, CircleCheck, CircleX, Clock } from 'lucide-react'

const StatCard = ({ icon: Icon, label, count, iconColor = 'text-neutral-200' }) => {
  return (
    <div className="group flex items-center gap-4 bg-neutral-900 rounded-xl p-5 w-full border border-neutral-700 hover:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-lg">
      <div className={`p-2.5 rounded-xl bg-neutral-800 ${iconColor} transition-colors duration-200`}>
        <Icon className="w-7.5 h-7.5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-400 truncate">{label}</p>
        <h3 className="text-2xl font-bold text-neutral-100 tracking-tight">{count}</h3>
      </div>
    </div>
  )
}

const StatPanel = ({ stats }) => {
  const {
    foundCount = 0,
    totalClaims = 0,
    approvedClaims = 0,
    rejectedClaims = 0,
    pendingClaims = 0
  } = stats

  const items = [
    { 
      label: 'My Found Items', 
      count: foundCount, 
      icon: CircleDollarSign,

      iconColor: 'text-blue-400',
    },
    { 
      label: 'My Total Claims', 
      count: totalClaims, 
      icon: HandCoins,

      iconColor: 'text-purple-400',
    },
    { 
      label: 'Claims Approved', 
      count: approvedClaims, 
      icon: CircleCheck,

      iconColor: 'text-green-400',
    },
    { 
      label: 'Claims Rejected', 
      count: rejectedClaims, 
      icon: CircleX,

      iconColor: 'text-red-400',
    },
    { 
      label: 'Claims Pending', 
      count: pendingClaims, 
      icon: Clock,

      iconColor: 'text-amber-400',
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  )
}

export default StatPanel
