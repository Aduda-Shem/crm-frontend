import api from './api'

// Generic paginated response
export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Helper for DataTable normalization
function normalizeListResponse(data: any, itemsKey: string) {
  return {
    results: data[itemsKey] ?? [],
    count: data.total ?? 0,
    page: data.current_page,
    lastPage: data.last_page,
    message: data.message,
  }
}

/**
 *  Leads
 *  */
export const listLeads = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('leads/', { params, headers })
  return normalizeListResponse(data, 'leads')
}

export const retrieveLead = async (id: number | string, headers: any = {}) => {
  const { data } = await api.get('leads/', { headers, params: { id } })
  return data.leads?.[0]
}

export const createLead = async (payload: any, headers: any = {}) => {
  const { data } = await api.post('leads/', payload, { headers })
  return data
}

export const updateLead = async (id: number | string, payload: any, headers: any = {}) => {
  const { data } = await api.put('leads/', payload, { headers, params: { id } })
  return data
}

export const deleteLead = async (id: number | string, headers: any = {}) => {
  const { data } = await api.delete('leads/', { headers, params: { id } })
  return data
}

export const leadSummary = async (id: number | string, headers: any = {}) => {
  const { data } = await api.get(`leads/${id}/summary/`, { headers })
  return data
}

/**
 *  Contacts
 *  */
export const listContacts = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('contacts/', { params, headers })
  return normalizeListResponse(data, 'contacts')
}

export const retrieveContact = async (id: number | string, headers: any = {}) => {
  const { data } = await api.get('contacts/', { headers, params: { id } })
  return data.contacts?.[0]
}

export const createContact = async (payload: any, headers: any = {}) => {
  const { data } = await api.post('contacts/', payload, { headers })
  return data
}

// ✅ All updates now use query param
export const updateContact = async (id: number | string, payload: any, headers: any = {}) => {
  const { data } = await api.put('contacts/', payload, { headers, params: { id } })
  return data
}

export const deleteContact = async (id: number | string, headers: any = {}) => {
  const { data } = await api.delete('contacts/', { headers, params: { id } })
  return data
}

/**
 *  Notes
 *  */
export const listNotes = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('notes/', { params, headers })
  return data as PaginatedResponse<any>
}

export const createNote = async (payload: any, headers: any = {}) => {
  const { data } = await api.post('notes/', payload, { headers })
  return data
}

export const updateNote = async (id: number | string, payload: any, headers: any = {}) => {
  const { data } = await api.put('notes/', payload, { headers, params: { id } })
  return data
}

export const deleteNote = async (id: number | string, headers: any = {}) => {
  const { data } = await api.delete('notes/', { headers, params: { id } })
  return data
}

/**
 *  Reminders
 *  */
export const listReminders = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('reminders/', { params, headers })
  return data as PaginatedResponse<any>
}

export const createReminder = async (payload: any, headers: any = {}) => {
  const { data } = await api.post('reminders/', payload, { headers })
  return data
}

export const updateReminder = async (id: number | string, payload: any, headers: any = {}) => {
  const { data } = await api.put('reminders/', payload, { headers, params: { id } })
  return data
}

export const deleteReminder = async (id: number | string, headers: any = {}) => {
  const { data } = await api.delete('reminders/', { headers, params: { id } })
  return data
}

/**
 *  Correspondence
 *  */
export const listCorrespondence = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('correspondence/', { params, headers })
  return data as PaginatedResponse<any>
}

export const createCorrespondence = async (payload: any, headers: any = {}) => {
  const { data } = await api.post('correspondence/', payload, { headers })
  return data
}

export const updateCorrespondence = async (id: number | string, payload: any, headers: any = {}) => {
  const { data } = await api.put('correspondence/', payload, { headers, params: { id } })
  return data
}

export const deleteCorrespondence = async (id: number | string, headers: any = {}) => {
  const { data } = await api.delete('correspondence/', { headers, params: { id } })
  return data
}

/**
 *  Audit (read-only)
 *  */
export const listAudit = async (params: any = {}, headers: any = {}) => {
  const { data } = await api.get('audit/', { params, headers })
  return normalizeListResponse(data, 'audit_entries')
}

/**
 *  Default export
 *  */
export default {
  // leads
  listLeads, retrieveLead, createLead, updateLead, deleteLead, leadSummary,
  // contacts
  listContacts, retrieveContact, createContact, updateContact, deleteContact,
  // notes
  listNotes, createNote, updateNote, deleteNote,
  // reminders
  listReminders, createReminder, updateReminder, deleteReminder,
  // correspondence
  listCorrespondence, createCorrespondence, updateCorrespondence, deleteCorrespondence,
  // audit
  listAudit,
}
