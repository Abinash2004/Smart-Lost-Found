import axios from 'axios'
import useAuthStore from '../store/useAuthStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
  withCredentials: false,
})

// ✅ Automatically add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Auto-logout on 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const useAuth = useAuthStore.getState()
      useAuth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
