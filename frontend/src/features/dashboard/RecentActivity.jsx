import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ClaimCard from '../claim/ClaimCard'
import FoundCard from '../found/FoundCard'

const SectionHeader = ({ title, showAllLink }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {showAllLink && (
      <Link 
        to={showAllLink} 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        View all <ChevronRight className="ml-1 w-4 h-4" />
      </Link>
    )}
  </div>
)

const CardGrid = ({ items, type, onApprove, onReject }) => {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
        <p className="text-sm text-gray-500">No entries found</p>
      </div>
    )
  }

  if (type === 'found') {
    // For mobile: Show only first 3 items in a vertical stack
    const mobileView = (
      <div className="space-y-4 md:hidden">
        {items.slice(0, 3).map((item, index) => (
          <div 
            key={`mobile-${item._id}-${index}`}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:scale-[1.01] shadow-sm hover:shadow-md overflow-hidden animate-fadeIn"
            style={{
              opacity: 0,
              animation: `fadeIn 0.3s ease-out ${index * 0.1}s forwards`
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

    // For desktop: Show the horizontal scrolling animation
    const desktopView = (
      <div className="hidden md:block relative overflow-hidden">
        <style jsx global>{`
          @keyframes smoothScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-${400 * items.length}px - 1rem * ${items.length - 1})); }
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          .marquee-container {
            display: flex;
            gap: 1rem;
            animation: smoothScroll ${items.length * 2}s linear infinite;
            padding: 0.5rem 0;
            width: max-content;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-container">
          {[...items, ...items].map((item, index) => (
            <div
              key={`desktop-${item._id}-${index}`}
              className="w-[320px] sm:w-[400px] flex-shrink-0"
              style={{ flex: '0 0 auto' }}
            >
              <div className="h-full bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-200 shadow-sm hover:shadow-md overflow-hidden">
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
      <>
        {mobileView}
        {desktopView}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(claim => (
        <div key={claim._id} className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-200 shadow-sm hover:shadow-md overflow-hidden">
          <ClaimCard
            claim={claim}
            showActions={!!(onApprove && onReject)}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      ))}
    </div>
  )
}

const RecentActivity = ({ foundItems, myClaims, claimsOnMyPosts, onApprove, onReject }) => (
  <div className="space-y-8">
    <section>
      <SectionHeader title="Latest Found Items" showAllLink="/found/pending" />
      <div className="bg-gray-50 rounded-xl p-1.5">
        <CardGrid items={foundItems} type="found" />
      </div>
    </section>

    <section>
      <SectionHeader title="Your Recent Claims" showAllLink="/claims/mine" />
      <div className="bg-gray-50 rounded-xl p-1.5">
        <CardGrid items={myClaims} type="claim" />
      </div>
    </section>

    <section>
      <SectionHeader title="Claims on Your Items" />
      <div className="bg-gray-50 rounded-xl p-1.5">
        <CardGrid
          items={claimsOnMyPosts}
          type="claim"
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </section>
  </div>
)

export default RecentActivity
