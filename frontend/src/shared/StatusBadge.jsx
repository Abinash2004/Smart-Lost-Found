import * as FiIcons from 'react-icons/fi';

// Status badge configuration
const statusConfig = {
  Pending: {
    className: 'bg-yellow-100 text-yellow-700',
    icon: 'FiClock',
    text: 'Pending'
  },
  Approved: {
    className: 'bg-green-100 text-green-700',
    icon: 'FiCheck',
    text: 'Approved'
  },
  Rejected: {
    className: 'bg-red-100 text-red-700',
    icon: 'FiX',
    text: 'Rejected'
  },
  Resolved: {
    className: 'bg-green-100 text-green-700',
    icon: 'FiCheckCircle',
    text: 'Resolved'
  }
};

// Category configuration - matching FoundForm.jsx
const categoryConfig = {
  'Electronics': 'FiMonitor',
  'Documents & ID': 'FiFileText',
  'Clothing & Accessories': 'FiAward',
  'Stationery & Books': 'FiBook',
  'Keys & Cards': 'FiKey',
  'Jewelry & Valuables': 'FiAward',
  'Miscellaneous': 'FiBox'
};

// Map of old category names to new ones for backward compatibility
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
  const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium space-x-1.5';

  // If it's a category badge
  if (category) {
    // Map the category name to the new format if needed
    const mappedCategory = categoryNameMap[status] || status;
    // Get the icon from the config, or use FiHelpCircle as fallback
    const iconName = categoryConfig[mappedCategory] || 'FiHelpCircle';
    const IconComponent = FiIcons[iconName] || FiIcons.FiHelpCircle;
    
    return (
      <span className={`${base} bg-blue-100 text-blue-700 ${className}`}>
        <IconComponent className="w-3 h-3" />
        <span>{mappedCategory}</span>
      </span>
    );
  }

  // Otherwise, it's a status badge
  const config = statusConfig[status] || {
    className: 'bg-gray-200 text-gray-700',
    icon: 'FiHelpCircle',
    text: status
  };

  const IconComponent = FiIcons[config.icon] || FiIcons.FiHelpCircle;

  return (
    <span className={`${base} ${config.className} ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span>{config.text}</span>
    </span>
  )
}

export default StatusBadge
