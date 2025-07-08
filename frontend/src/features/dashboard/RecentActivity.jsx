import RecentFoundItemsSection from './components/RecentFoundItemsSection';
import MyRecentClaimsSection from './components/MyRecentClaimsSection';
import ClaimsOnMyPostsSection from './components/ClaimsOnMyPostsSection';

const RecentActivity = ({ 
  foundItems = [], 
  myClaims = [], 
  claimsOnMyPosts = [], 
  onApprove, 
  onReject 
}) => (
  <div className="space-y-12">
    <RecentFoundItemsSection items={foundItems} />
    
    <MyRecentClaimsSection 
      claims={myClaims}
      onApprove={onApprove}
      onReject={onReject}
    />
    
    <ClaimsOnMyPostsSection 
      claims={claimsOnMyPosts}
      onApprove={onApprove}
      onReject={onReject}
    />
  </div>
);

export default RecentActivity;
