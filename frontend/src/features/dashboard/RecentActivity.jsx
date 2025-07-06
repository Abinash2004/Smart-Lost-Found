import { Link } from 'react-router-dom'
import ClaimCard from '../claim/ClaimCard'
import FoundCard from '../found/FoundCard'

const SectionHeader = ({ title, showAllLink }) => (
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-lg font-semibold">{title}</h3>
    {showAllLink && (
      <Link to={showAllLink} className="text-sm text-blue-600 hover:underline">
        Show All
      </Link>
    )}
  </div>
)

const CardGrid = ({ items, type, onApprove, onReject }) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No entries found.</p>
  }

  if (type === 'found') {
    return (
      <div className="overflow-hidden relative group">
        <div
          className="flex gap-4 animate-marquee group-hover:paused"
          style={{ animationDuration: `${items.length * 4}s` }}
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="w-[calc(100%/3-1rem)] shrink-0"
              style={{ minWidth: 'calc(100% / 3 - 1rem)' }}
            >
              <FoundCard
                item={item}
                filter={item.status === 'Pending' ? 'Pending' : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(claim => (
        <ClaimCard
          key={claim._id}
          claim={claim}
          showActions={!!(onApprove && onReject)}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  )
}

const RecentActivity = ({ foundItems, myClaims, claimsOnMyPosts, onApprove, onReject }) => (
  <div className="space-y-6">
    <div>
      <SectionHeader title="Latest Found Items Posted" />
      <CardGrid items={foundItems} type="found" />
    </div>

    <div>
      <SectionHeader title="Latest Claims Submitted by You" showAllLink="/claims/mine" />
      <CardGrid items={myClaims} type="claim" />
    </div>

    <div>
      <SectionHeader title="Latest Claims Received on Your Items" />
      <CardGrid
        items={claimsOnMyPosts}
        type="claim"
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  </div>
)

export default RecentActivity
