import { create } from 'zustand'
import type { Account } from '@/types/api'

interface AuthState {
  user: Account | null
  isAuthenticated: boolean
  setUser: (user: Account | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
