import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: null,

  setAuth: ({ token, user }) => {
    localStorage.setItem('token', token)
    set(() => ({ token, user }))
  },

  logout: () => {
    localStorage.removeItem('token')
    set(() => ({ token: null, user: null }))
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}))

export default useAuthStore
