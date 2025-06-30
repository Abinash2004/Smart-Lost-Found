import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import LoadingSpinner from '../shared/LoadingSpinner'
import EmptyState from '../shared/EmptyState'
import ClaimCard from '../features/claim/ClaimCard'

const MyClaims = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClaimsWithItemInfo = async () => {
      try {
        // 1. Fetch all claims submitted by the user
        const res = await axios.get('/claim-items/personal')
        const rawClaims = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.claims)
            ? res.data.claims
            : []

        // 2. For each claim, fetch the associated found item using foundItemId
        const enrichedClaims = await Promise.all(
          rawClaims.map(async (claim) => {
            try {
              const foundItemRes = await axios.get(`/found-items/${claim.foundItemId}`)
              return {
                ...claim,
                foundItem: foundItemRes.data // attach found item info
              }
            } catch (err) {
              console.error(`Error fetching item for claim ${claim._id}:`, err)
              return {
                ...claim,
                foundItem: null // fallback
              }
            }
          })
        )

        // 3. Sort claims by createdAt (descending)
        const sorted = enrichedClaims.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setClaims(sorted)
      } catch (err) {
        console.error('Failed to fetch personal claims:', err)
        setClaims([])
      } finally {
        setLoading(false)
      }
    }

    fetchClaimsWithItemInfo()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">My Claim Submissions</h2>

      {loading ? (
        <LoadingSpinner />
      ) : claims.length === 0 ? (
        <EmptyState message="You haven't submitted any claims yet." />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {claims.map((claim) => (
            <ClaimCard
              key={claim._id}
              claim={claim}
              showFoundInfo={!!claim.foundItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyClaims
