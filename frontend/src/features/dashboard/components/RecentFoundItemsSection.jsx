import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FoundCard from '../../found/FoundCard';

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

const RecentFoundItemsSection = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="dashboard-card p-6 text-center">
        <p className="section-subtitle">No found items to display</p>
      </div>
    );
  }

  // Mobile view
  const mobileView = (
    <div className="space-y-4 md:hidden">
      {items.slice(0, 3).map((item, index) => (
        <div 
          key={`mobile-${item._id}-${index}`}
          className="dashboard-card card-hover animate-fadeIn"
          style={{
            '--delay': `${index * 0.1}s`,
            animationDelay: `calc(var(--delay) * ${index})`
          }}
        >
          <FoundCard
            item={item}
            filter={item.status === 'Pending' ? 'Pending' : undefined}
          />
        </div>
      ))}
    </div>
  );

  // Desktop view with animation
  const desktopView = (
    <div className="hidden md:block relative overflow-hidden">
      <div 
        className="marquee-container animate-smoothScroll group"
        style={{
          '--scroll-distance': `calc(-${400 * items.length}px - 1rem * ${items.length - 1})`,
          '--scroll-duration': `${Math.max(items.length * 2, 10)}s`
        }}
      >
        {[...items, ...items].map((item, index) => (
          <div key={`desktop-${item._id}-${index}`} className="marquee-item">
            <div className="dashboard-card h-full">
              <FoundCard
                item={item}
                filter={item.status === 'Pending' ? 'Pending' : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="Recent Found Items" showAllLink="/found/pending" />
      {mobileView}
      {desktopView}
    </div>
  );
};

export default RecentFoundItemsSection;
