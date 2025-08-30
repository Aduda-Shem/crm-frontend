import axios from 'axios'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/',
  timeout: 15000,
})

// Attach token & handle 401/403 globally
api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth?.accessToken) {
    config.headers = config.headers || {}
      ; (config.headers as any).Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const auth = useAuthStore()
    const status = err?.response?.status
    if (status === 401 || status === 403) {
      auth.logout()
    } else if (status >= 500) {
      // optionally handle server errors globally
    }
    return Promise.reject(err)
  }
)

export type Credentials = { username: string; password: string }
export type RegisterData = { username: string; password: string; email?: string; role?: 'MANAGER' | 'AGENT' }

// Auth
export async function login(payload: Credentials) {
  const { data } = await api.post('auth/token/', payload)
  return data as { access: string; refresh: string }
}

export async function register(payload: RegisterData) {
  const { data } = await api.post('auth/register/', payload)
  return data
}

// Leads
export async function getLeads(params: any = {}, headers: any = {}) {
  const { data } = await api.get('leads/', { params, headers })
  return data
}

export async function getLead(id: number | string, headers: any = {}) {
  const list = await getLeads({ id }, headers)
  const item = (list.results || list || []).find((x: any) => String(x.id) === String(id))
  return item
}

export async function updateLead(payload: any, headers: any = {}) {
  const { data } = await api.put('leads/', payload, { headers })
  return data
}

export async function createLead(payload: any, headers: any = {}) {
  const { data } = await api.post('leads/', payload, { headers })
  return data
}

export async function getLeadSummary(id: number | string, headers: any = {}) {
  const { data } = await api.get(`leads/${id}/summary/`, { headers })
  return data
}

export async function deleteLead(id: number | string, headers: any = {}) {
  const { data } = await api.delete('leads/', { params: { id }, headers })
  return data
}

// Contacts
export async function getContacts(params: any = {}, headers: any = {}) {
  const { data } = await api.get('contacts/', { params, headers })
  return data
}

export async function createContact(payload: any, headers: any = {}) {
  const { data } = await api.post('contacts/', payload, { headers })
  return data
}

export async function updateContact(payload: any, headers: any = {}) {
  const { data } = await api.put('contacts/', payload, { headers })
  return data
}

export async function deleteContact(id: number | string, headers: any = {}) {
  const { data } = await api.delete('contacts/', { params: { id }, headers })
  return data
}

// Notes
export async function getNotes(params: any = {}, headers: any = {}) {
  const { data } = await api.get('notes/', { params, headers })
  return data
}

export async function createNote(payload: any, headers: any = {}) {
  const { data } = await api.post('notes/', payload, { headers })
  return data
}

export async function updateNote(payload: any, headers: any = {}) {
  const { data } = await api.put('notes/', payload, { headers })
  return data
}

export async function deleteNote(id: number | string, headers: any = {}) {
  const { data } = await api.delete('notes/', { params: { id }, headers })
  return data
}

// Reminders
export async function getReminders(params: any = {}, headers: any = {}) {
  const { data } = await api.get('reminders/', { params, headers })
  return data
}

export async function createReminder(payload: any, headers: any = {}) {
  const { data } = await api.post('reminders/', payload, { headers })
  return data
}

export async function updateReminder(payload: any, headers: any = {}) {
  const { data } = await api.put('reminders/', payload, { headers })
  return data
}

export async function deleteReminder(id: number | string, headers: any = {}) {
  const { data } = await api.delete('reminders/', { params: { id }, headers })
  return data
}

// Correspondence
export async function getCorrespondence(params: any = {}, headers: any = {}) {
  const { data } = await api.get('correspondence/', { params, headers })
  return data
}

export async function createCorrespondence(payload: any, headers: any = {}) {
  const { data } = await api.post('correspondence/', payload, { headers })
  return data
}

export async function updateCorrespondence(payload: any, headers: any = {}) {
  const { data } = await api.put('correspondence/', payload, { headers })
  return data
}

export async function deleteCorrespondence(id: number | string, headers: any = {}) {
  const { data } = await api.delete('correspondence/', { params: { id }, headers })
  return data
}

export default api
