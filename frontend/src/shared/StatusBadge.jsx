/** @jsxImportSource react */
import { FiClock, FiCheck, FiX, FiCheckCircle, FiMonitor, FiFileText, 
  FiAward, FiBook, FiKey, FiBox, FiHelpCircle } from 'react-icons/fi';

const getStatusConfig = (status) => {
  // Return configuration without JSX elements
  const configs = {
    Pending: { 
      className: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800 hover:bg-yellow-900/40',
      icon: 'FiClock',
      iconClass: 'text-yellow-400'
    },
    Approved: { 
      className: 'bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-900/40',
      icon: 'FiCheck',
      iconClass: 'text-green-400'
    },
    Rejected: { 
      className: 'bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-900/40',
      icon: 'FiX',
      iconClass: 'text-red-400'
    },
    Resolved: { 
      className: 'bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-900/40',
      icon: 'FiCheckCircle',
      iconClass: 'text-green-400'
    }
  };
  
  return configs[status] || { 
    className: 'bg-neutral-800/50 text-neutral-300 border border-neutral-700 hover:bg-neutral-800/70',
    icon: 'FiHelpCircle',
    iconClass: 'text-neutral-400'
  };
};

// Icon component map
const IconComponent = {
  FiClock,
  FiCheck,
  FiX,
  FiCheckCircle,
  FiMonitor,
  FiFileText,
  FiAward,
  FiBook,
  FiKey,
  FiBox,
  FiHelpCircle
};

// Map category names to their corresponding icon components
const categoryIcons = {
  'Electronics': FiMonitor,
  'Documents & ID': FiFileText,
  'Clothing & Accessories': FiAward,
  'Stationery & Books': FiBook,
  'Keys & Cards': FiKey,
  'Jewelry & Valuables': FiAward,
  'Miscellaneous': FiBox
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
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium space-x-2 transition-all duration-200';

  if (category) {
    const mappedCategory = categoryNameMap[status] || status;
    const CategoryIcon = categoryIcons[mappedCategory] || FiHelpCircle;
    
    return (
      <span className={`${base} bg-gray-50 text-gray-700 border border-gray-100 ${className}`}>
        <CategoryIcon className="w-3 h-3" />
        <span>{mappedCategory}</span>
      </span>
    );
  }

  const { className: statusClass, icon: iconName, iconClass } = getStatusConfig(status);
  const Icon = IconComponent[iconName] || FiHelpCircle;
  
  return (
    <span className={`${base} ${statusClass} ${className}`}>
      <Icon className={`w-3 h-3 ${iconClass}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
