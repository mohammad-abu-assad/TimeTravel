import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { http } from '../api/http'

type User = { id: number; email: string } | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  // bootstrap from token on first load
  useEffect(() => {
    const token = localStorage.getItem('tt_access_token')
    if (!token) {
      setLoading(false)
      return
    }
    http.get('/auth/me')
      .then(r => setUser(r.data.me))
      .catch(() => {
        localStorage.removeItem('tt_access_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (token: string) => {
    localStorage.setItem('tt_access_token', token)
    try {
      setLoading(true)
      const r = await http.get('/auth/me')
      setUser(r.data.me)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('tt_access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
