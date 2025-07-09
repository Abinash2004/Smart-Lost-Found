import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiClock as FiClockIcon, FiAward } from 'react-icons/fi';
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
      className="group bg-neutral-900 rounded-xl border border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
    >
      <div className="p-6 pb-4 flex-grow group-hover:bg-neutral-800/50 transition-colors duration-300">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-xl font-semibold text-white line-clamp-1 pr-2">
              {foundItem?.title || 'Untitled Item'}
            </h3>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={status} className="shrink-0" />
              {claim.score !== undefined && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-blue-800 bg-blue-900/30 text-blue-300 hover:bg-blue-900/40 transition-colors">
                  <FiAward className="w-3 h-3 mr-1.5 text-blue-400" />
                  <span>{claim.score}% match</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 text-neutral-300">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                <FiMapPin className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
              </div>
              <span className="text-neutral-200">{foundItem?.foundLocation || 'Location not specified'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Claimant
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                      <FiUser className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-neutral-200">{fullName || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                      <FiPhone className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-neutral-200">{contactNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Founder
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                      <FiUser className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-neutral-200">{foundItem?.foundByName || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-700 rounded-lg group-hover:bg-neutral-600/50 transition-colors duration-300">
                      <FiPhone className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-neutral-200">{foundItem?.foundByContact || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-700 group-hover:bg-neutral-800 transition-colors duration-300">
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <div className="flex items-center">
            <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>Posted {format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <FiClockIcon className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>{format(new Date(createdAt), 'h:mm a')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;