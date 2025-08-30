import { defineStore } from 'pinia'
import api from '../services/api'
import { login as apiLogin } from '../services/api'

type Role = 'MANAGER' | 'AGENT' | null

function loadPersisted() {
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return { accessToken: '', refreshToken: '', role: null as Role }
    const parsed = JSON.parse(raw)
    return { accessToken: parsed.accessToken || '', refreshToken: parsed.refreshToken || '', role: parsed.role as Role }
  } catch { return { accessToken: '', refreshToken: '', role: null as Role } }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...loadPersisted(),
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    authHeader: (s) => (s.accessToken ? { Authorization: `Bearer ${s.accessToken}` } : {}),
  },
  actions: {
    persist() {
      localStorage.setItem('auth', JSON.stringify({ accessToken: this.accessToken, refreshToken: this.refreshToken, role: this.role }))
      if (this.accessToken) api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
      else delete api.defaults.headers.common['Authorization']
    },
    async login(username: string, password: string) {
      const tokens = await apiLogin({ username, password })
      this.accessToken = tokens.access
      this.refreshToken = tokens.refresh
      // TODO: fetch role/profile endpoint; keep previous if set
      this.role = this.role || 'MANAGER'
      this.persist()
    },
    setRole(role: Role) { this.role = role; this.persist() },
    logout() { this.accessToken = ''; this.refreshToken = ''; this.role = null; this.persist(); localStorage.removeItem('auth') },
  },
})
