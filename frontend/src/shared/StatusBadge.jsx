import React from 'react';
import { FiClock, FiCheck, FiX, FiCheckCircle, FiMonitor, FiFileText, 
  FiAward, FiBook, FiKey, FiBox, FiHelpCircle } from 'react-icons/fi';

const getStatusConfig = (status) => {
  const configs = {
    Pending: { 
      className: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800 hover:bg-yellow-900/40', 
      icon: <FiClock className="w-3 h-3 text-yellow-400" /> 
    },
    Approved: { 
      className: 'bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-900/40', 
      icon: <FiCheck className="w-3 h-3 text-green-400" /> 
    },
    Rejected: { 
      className: 'bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-900/40', 
      icon: <FiX className="w-3 h-3 text-red-400" /> 
    },
    Resolved: { 
      className: 'bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-900/40', 
      icon: <FiCheckCircle className="w-3 h-3 text-green-400" /> 
    }
  };
  
  return configs[status] || { 
    className: 'bg-neutral-800/50 text-neutral-300 border border-neutral-700 hover:bg-neutral-800/70', 
    icon: <FiHelpCircle className="w-3 h-3 text-neutral-400" /> 
  };
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
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium space-x-2 transition-all duration-200';

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

  const { className: statusClass, icon } = getStatusConfig(status);
  
  return (
    <span className={`${base} ${statusClass} ${className}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
