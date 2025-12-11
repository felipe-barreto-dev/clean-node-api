import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { SignupData, LoginData } from '@/types/api'

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: clearUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = async (data: SignupData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.signup(data)
      setUser({ id: '', name: response.name, email: data.email })
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: LoginData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.login(data.email, data.password)
      setUser({ id: '', name: response.name, email: data.email })
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await api.logout()
    clearUser()
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    logout,
  }
}
