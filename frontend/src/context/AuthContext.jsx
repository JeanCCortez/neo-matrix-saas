import { createContext, useContext, useState, useEffect } from 'react'
import { user as userApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const apiKey = localStorage.getItem('neo_api_key')
    if (!apiKey) {
      setLoading(false)
      return
    }

    try {
      const userData = await userApi.getMe()
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('neo_api_key')
      localStorage.removeItem('neo_is_admin')
    } finally {
      setLoading(false)
    }
  }

  function login(apiKey, userData, isAdmin = false) {
    localStorage.setItem('neo_api_key', apiKey)
    if (isAdmin) {
      localStorage.setItem('neo_is_admin', 'true')
    }
    setUser(userData || { api_key: apiKey })
  }

  function logout() {
    localStorage.removeItem('neo_api_key')
    localStorage.removeItem('neo_is_admin')
    setUser(null)
  }

  async function refreshUser() {
    try {
      const userData = await userApi.getMe()
      setUser(userData)
      return userData
    } catch (err) {
      return null
    }
  }

  const isAdmin = localStorage.getItem('neo_is_admin') === 'true'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
