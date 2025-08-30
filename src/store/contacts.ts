import { defineStore } from 'pinia'
import { listContacts, createContact, updateContact, deleteContact } from '../services/endpoints'
import { useAuthStore } from './auth'

export const useContactsStore = defineStore('contacts', {
  state: () => ({ items: [] as any[], total: 0, loading: false }),
  actions: {
    async fetch(params: any = {}) {
      this.loading = true
      try { const auth = useAuthStore(); const data = await listContacts(params, auth.authHeader); this.items = data.results; this.total = data.count }
      finally { this.loading = false }
    },
    async create(payload: any) { const auth = useAuthStore(); return await createContact(payload, auth.authHeader) },
    async update(id: number, payload: any) { const auth = useAuthStore(); return await updateContact(id, payload, auth.authHeader) },
    async remove(id: number) { const auth = useAuthStore(); return await deleteContact(id, auth.authHeader) },
  }
})


