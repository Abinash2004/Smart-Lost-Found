// src/pages/MyFoundPosts.jsx
import FoundList from './FoundList'
import useAuthStore from '../../store/useAuthStore'

const MyFoundPosts = () => {
  const { user } = useAuthStore()

  return <FoundList filter="Mine" />
}

export default MyFoundPosts
