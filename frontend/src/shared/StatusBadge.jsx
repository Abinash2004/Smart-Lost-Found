import { FiClock, FiCheck, FiX, FiCheckCircle, FiMonitor, FiFileText, 
  FiAward, FiBook, FiKey, FiBox, FiHelpCircle } from 'react-icons/fi';

const statusConfig = status => ({
  Pending: { 
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200', 
    icon: <FiClock className="w-3 h-3" /> 
  },
  Approved: { 
    className: 'bg-green-50 text-green-700 border border-green-200', 
    icon: <FiCheck className="w-3 h-3" /> 
  },
  Rejected: { 
    className: 'bg-red-50 text-red-700 border border-red-200', 
    icon: <FiX className="w-3 h-3" /> 
  },
  Resolved: { 
    className: 'bg-green-50 text-green-700 border border-green-200', 
    icon: <FiCheckCircle className="w-3 h-3" /> 
  },
})[status] || { 
  className: 'bg-gray-50 text-gray-700 border border-gray-200', 
  icon: <FiHelpCircle className="w-3 h-3" /> 
};

const categoryIcons = {
  'Electronics': <FiMonitor className="w-3 h-3" />,
  'Documents & ID': <FiFileText className="w-3 h-3" />,
  'Clothing & Accessories': <FiAward className="w-3 h-3" />,
  'Stationery & Books': <FiBook className="w-3 h-3" />,
  'Keys & Cards': <FiKey className="w-3 h-3" />,
  'Jewelry & Valuables': <FiAward className="w-3 h-3" />,
  'Miscellaneous': <FiBox className="w-3 h-3" />
};

const categoryNameMap = {
  'Electronics': 'Electronics',
  'Documents': 'Documents & ID',
  'Wallets': 'Miscellaneous',
  'Bags': 'Miscellaneous',
  'Accessories': 'Clothing & Accessories',
  'Headphones': 'Electronics',
  'Keys': 'Keys & Cards',
  'Clothing': 'Clothing & Accessories',
  'Other': 'Miscellaneous'
};

const StatusBadge = ({ status, category = false, className = '' }) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium space-x-2';

  if (category) {
    const mappedCategory = categoryNameMap[status] || status;
    const icon = categoryIcons[mappedCategory] || <FiHelpCircle className="w-3 h-3" />;
    
    return (
      <span className={`${base} bg-gray-50 text-gray-700 border border-gray-100 ${className}`}>
        {icon}
        <span>{mappedCategory}</span>
      </span>
    );
  }

  const { className: statusClass, icon } = statusConfig(status);
  
  return (
    <span className={`${base} ${statusClass} ${className}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
