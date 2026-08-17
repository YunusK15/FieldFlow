import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const backendUrl = import.meta.env.VITE_API_URL || ''
const API_BASE = `${backendUrl}/api`

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('fieldflow_token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('fieldflow_token')
    localStorage.removeItem('fieldflow_user')
    setToken(null)
    setUser(null)
  }, [])

  // On mount, restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('fieldflow_user')
    if (storedUser && token) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser))
      } catch {
        logout()
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false)
  }, [token, logout])

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    
    localStorage.setItem('fieldflow_token', data.token)
    localStorage.setItem('fieldflow_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    
    localStorage.setItem('fieldflow_token', data.token)
    localStorage.setItem('fieldflow_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }



  // Helper for authenticated fetch calls
  const authFetch = (url, options = {}) => {
    const backendUrl = import.meta.env.VITE_API_URL || ''
    const absoluteUrl = url.startsWith('http') ? url : `${backendUrl}${url}`
    return fetch(absoluteUrl, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
