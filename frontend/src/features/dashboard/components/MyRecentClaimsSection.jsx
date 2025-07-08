import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ClaimCard from '../../claim/ClaimCard';

const SectionHeader = ({ title, showAllLink }) => (
  <div className="section-header">
    <div className="flex justify-between items-center">
      <h3 className="section-title">{title}</h3>
      {showAllLink && (
        <Link to={showAllLink} className="section-view-all">
          View all <ChevronRight className="ml-1 w-3.5 h-3.5" />
        </Link>
      )}
    </div>
    <p className="section-subtitle">Recent updates and activities</p>
  </div>
);

const MyRecentClaimsSection = ({ claims = [], onApprove, onReject }) => {
  if (claims.length === 0) {
    return (
      <div className="dashboard-card p-6 text-center">
        <p className="section-subtitle">No claims to display</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="My Recent Claims" showAllLink="/claims/mine" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claims.slice(0, 3).map((claim) => (
          <div key={claim._id} className="dashboard-card">
            <ClaimCard
              claim={claim}
              showActions={!!(onApprove && onReject)}
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecentClaimsSection;
