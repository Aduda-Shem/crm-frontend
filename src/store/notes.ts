import { defineStore } from 'pinia'
import { listNotes, createNote, updateNote, deleteNote } from '../services/endpoints'
import { useAuthStore } from './auth'

export const useNotesStore = defineStore('notes', {
  state: () => ({ items: [] as any[], total: 0, loading: false }),
  actions: {
    async fetch(params: any = {}) {
      this.loading = true
      try { const auth = useAuthStore(); const data = await listNotes(params, auth.authHeader); this.items = data.results; this.total = data.count }
      finally { this.loading = false }
    },
    async create(payload: any) { const auth = useAuthStore(); return await createNote(payload, auth.authHeader) },
    async update(id: number, payload: any) { const auth = useAuthStore(); return await updateNote(id, payload, auth.authHeader) },
    async remove(id: number) { const auth = useAuthStore(); return await deleteNote(id, auth.authHeader) },
  }
})


