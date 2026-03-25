import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token')
      if (!token) { setLoading(false); return }
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally { setLoading(false) }
    }
    verify()
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    
    // ✅ Check if user is approved (backend already handles this, but double check)
    if (!data.user.isApproved && data.user.role !== 'admin') {
      // If not approved, don't store token
      toast.error('Your account is pending admin approval. You will be notified once approved.')
      throw new Error('Account pending approval')
    }
    
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    
    // ✅ Store user even if not approved (they can login but can't access videos)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))
    setUser(data.user)
    
    // ✅ Show approval pending message
    toast.success('Account created! Please wait for admin approval to access videos.', {
      duration: 5000,
    })
    
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback(u => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }, [])

  // ✅ Helper to check if user can access videos
  const canAccessVideos = useCallback(() => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.isApproved === true
  }, [user])

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAdmin:   user?.role === 'admin',
      isStudent: user?.role === 'student',
      isApproved: user?.isApproved || false,
      canAccessVideos,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}