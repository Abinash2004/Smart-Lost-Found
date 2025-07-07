import { CircleDollarSign, HandCoins, CircleCheck, CircleX, Clock } from 'lucide-react'

const StatCard = ({ icon: Icon, label, count }) => {
  return (
    <div className="group flex items-center gap-4 bg-white rounded-xl p-5 w-full border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="p-2.5 rounded-xl bg-gray-50 text-gray-800 group-hover:bg-gray-100 transition-colors duration-200">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{count}</h3>
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
    { label: 'My Found Items', count: foundCount, icon: CircleDollarSign },
    { label: 'My Total Claims', count: totalClaims, icon: HandCoins },
    { label: 'Claims Approved', count: approvedClaims, icon: CircleCheck },
    { label: 'Claims Rejected', count: rejectedClaims, icon: CircleX },
    { label: 'Claims Pending', count: pendingClaims, icon: Clock }
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
