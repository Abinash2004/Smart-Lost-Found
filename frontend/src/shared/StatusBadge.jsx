const StatusBadge = ({ status }) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold'

  const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Resolved: 'bg-green-100 text-green-700',
  }

  return (
    <span className={`${base} ${statusClasses[status] || 'bg-gray-200 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default StatusBadge
