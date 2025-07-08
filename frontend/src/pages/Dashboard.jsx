import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import StatPanel from '../features/dashboard/StatPanel'
import RecentActivity from '../features/dashboard/RecentActivity'
import QuickActions from '../features/dashboard/QuickActions'

const Dashboard = () => {
  const [stats, setStats] = useState({
    foundCount: 0,
    totalClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    pendingClaims: 0
  })

  const [recentFoundItems, setRecentFoundItems] = useState([])
  const [recentSubmittedClaims, setRecentSubmittedClaims] = useState([])
  const [recentReceivedClaims, setRecentReceivedClaims] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🔹 Get latest 10 public found items
        const allItems = (await axios.get('/found-items')).data || []
        setRecentFoundItems(
          [...allItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
        )

        // 🔹 Get user's own found items
        const myFoundItems = (await axios.get('/found-items/personal')).data.items || []
        setStats(s => ({ ...s, foundCount: myFoundItems.length }))

        // 🔹 Get claims submitted by user
        const myClaims = (await axios.get('/claim-items/personal')).data.claims || []
        const getCount = (status) => myClaims.filter(c => c.status === status).length
        setStats(s => ({
          ...s,
          totalClaims: myClaims.length,
          approvedClaims: getCount('Approved'),
          rejectedClaims: getCount('Rejected'),
          pendingClaims: getCount('Pending')
        }))

        // 🔹 Enrich recent 3 submitted claims with their item info
        const enrichedClaims = await Promise.all(
          myClaims.slice(0, 3).map(async (claim) => {
            const itemId = claim.foundItemId || claim.foundItem?._id
            if (!itemId) return claim
            try {
              const item = (await axios.get(`/found-items/${itemId}`)).data
              return { ...claim, foundItem: { ...item } }
            } catch {
              return claim
            }
          })
        )
        setRecentSubmittedClaims(enrichedClaims)

        // 🔹 Get latest 3 claims received on user's posts
        const receivedClaims = await Promise.all(
          myFoundItems.map(async item => {
            try {
              const res = await axios.get(`/claim-items/found/${item._id}`)
              return res.data.claims.map(c => ({ ...c, foundItem: { ...item } }))
            } catch {
              return []
            }
          })
        )
        const flatSorted = receivedClaims.flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)

        setRecentReceivedClaims(flatSorted)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }

    fetchDashboardData()
  }, [])

  const handleApprove = async (claimId) => {
    try {
      await axios.patch(`/claim-items/approve/${claimId}`)
      window.location.reload()
    } catch (err) {
      console.error('Approval failed:', err)
    }
  }

  const handleReject = async (claimId) => {
    try {
      await axios.patch(`/claim-items/reject/${claimId}`, {
        rejectionFeedback: 'Rejected from dashboard'
      })
      window.location.reload()
    } catch (err) {
      console.error('Rejection failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-100 mb-1">Dashboard Overview</h1>
          <p className="text-sm text-neutral-400">Welcome back! Here's what's happening with your account.</p>
        </div>
        
        <div className="space-y-8">
          <StatPanel stats={stats} />
          <QuickActions />
          <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <RecentActivity 
                foundItems={recentFoundItems}
                myClaims={recentSubmittedClaims}
                claimsOnMyPosts={recentReceivedClaims}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
