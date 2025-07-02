import { CircleDollarSign, HandCoins, CircleCheck, CircleX, Clock } from 'lucide-react'

const StatCard = ({ icon: Icon, label, count, color }) => {
  return (
    <div className="flex items-center gap-4 bg-white shadow rounded-2xl p-4 w-full">
      <div className={`p-3 rounded-full ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-xl font-semibold">{count}</h3>
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
    { label: 'My Found Items', count: foundCount, icon: CircleDollarSign, color: 'bg-blue-500' },
    { label: 'My Total Claims', count: totalClaims, icon: HandCoins, color: 'bg-green-500' },
    { label: 'Claims Approved', count: approvedClaims, icon: CircleCheck, color: 'bg-emerald-500' },
    { label: 'Claims Rejected', count: rejectedClaims, icon: CircleX, color: 'bg-rose-500' },
    { label: 'Claims Pending', count: pendingClaims, icon: Clock, color: 'bg-yellow-500' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  )
}

export default StatPanel
