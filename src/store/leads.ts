import { defineStore } from 'pinia'
import { listLeads, createLead, updateLead, deleteLead } from '../services/endpoints'
import { useAuthStore } from './auth'

export const useLeadsStore = defineStore('leads', {
  state: () => ({ items: [] as any[], total: 0, loading: false }),
  actions: {
    async fetch(params: any = {}) {
      this.loading = true
      try { const auth = useAuthStore(); const data = await listLeads(params, auth.authHeader); this.items = data.results; this.total = data.count }
      finally { this.loading = false }
    },
    async create(payload: any) { const auth = useAuthStore(); return await createLead(payload, auth.authHeader) },
    async update(id: number, payload: any) { const auth = useAuthStore(); return await updateLead(id, payload, auth.authHeader) },
    async remove(id: number) { const auth = useAuthStore(); return await deleteLead(id, auth.authHeader) },
  }
})


