import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiClock as FiClockIcon } from 'react-icons/fi';
import StatusBadge from '../../shared/StatusBadge';

const ClaimCard = ({ claim }) => {
  const navigate = useNavigate();

  const {
    _id,
    fullName,
    contactNumber,
    status,
    createdAt,
    foundItem,
  } = claim;

  return (
    <div
      onClick={() => navigate(`/claims/${_id}`, { state: { claim } })}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer hover:border-gray-300 transform hover:-translate-y-1 hover:scale-[1.01]"
    >
      <div className="p-5 group-hover:bg-gray-50 transition-colors duration-300">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
            {foundItem?.title || 'Untitled Item'}
          </h3>
          <StatusBadge status={status} className="shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <FiMapPin className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <span className="text-sm text-gray-700">{foundItem?.foundLocation || 'Location not specified'}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Claimant
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                  <FiUser className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800">{fullName || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                  <FiPhone className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800">{contactNumber || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Founder
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                  <FiUser className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800">{foundItem?.foundByName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                  <FiPhone className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800">{foundItem?.foundByContact || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto group-hover:bg-gray-100 transition-colors duration-300">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClockIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>{format(new Date(createdAt), 'h:mm a')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;