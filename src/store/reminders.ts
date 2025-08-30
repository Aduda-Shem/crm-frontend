import { defineStore } from 'pinia'
import { listReminders, createReminder, updateReminder, deleteReminder } from '../services/endpoints'
import { useAuthStore } from './auth'

export const useRemindersStore = defineStore('reminders', {
  state: () => ({ items: [] as any[], total: 0, loading: false }),
  actions: {
    async fetch(params: any = {}) {
      this.loading = true
      try { const auth = useAuthStore(); const data = await listReminders(params, auth.authHeader); this.items = data.results; this.total = data.count }
      finally { this.loading = false }
    },
    async create(payload: any) { const auth = useAuthStore(); return await createReminder(payload, auth.authHeader) },
    async update(id: number, payload: any) { const auth = useAuthStore(); return await updateReminder(id, payload, auth.authHeader) },
    async remove(id: number) { const auth = useAuthStore(); return await deleteReminder(id, auth.authHeader) },
  }
})


