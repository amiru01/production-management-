import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Role } from '../lib/permissions'

interface User {
  name: string
  email: string
  role: Role
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const mockUsers: { email: string; password: string; user: User }[] = [
  { email: 'admin@lumen.studio', password: 'admin123', user: { name: 'Alex Rivera', email: 'admin@lumen.studio', role: 'admin' } },
  { email: 'manager@lumen.studio', password: 'manager123', user: { name: 'Jordan Chen', email: 'manager@lumen.studio', role: 'manager' } },
  { email: 'crew@lumen.studio', password: 'crew123', user: { name: 'Sam Wilson', email: 'crew@lumen.studio', role: 'crew' } },
  { email: 'accountant@lumen.studio', password: 'accountant123', user: { name: 'Taylor Reed', email: 'accountant@lumen.studio', role: 'accountant' } },
  { email: 'client@lumen.studio', password: 'client123', user: { name: 'Morgan Chase', email: 'client@lumen.studio', role: 'client' } },
]

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600))
    const found = mockUsers.find((u) => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password.' }
    setUser(found.user)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
