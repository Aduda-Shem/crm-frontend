<template>
  <div>
    <DataTable
      title="Correspondence"
      :headers="headers"
      :items="items"
      :total="total"
      :loading="loading"
      :page-size="query.pageSize"
      search-label="Search correspondence"
      @update:query="onQuery"
    >
      <template #row-actions="{ item }">
        <v-btn size="small" icon="mdi-pencil" variant="text" @click.stop="edit(item)" />
        <v-btn size="small" icon="mdi-delete" variant="text" color="error" @click.stop="tryDelete(item)" />
      </template>
    </DataTable>

    <!-- Floating Add Button -->
    <v-btn
      color="primary"
      class="position-fixed"
      style="right:24px; bottom:24px"
      icon="mdi-plus"
      @click="openCreate"
    />

    <!-- Correspondence Modal -->
    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title>{{ current?.id ? 'Edit Correspondence' : 'New Correspondence' }}</v-card-title>
        <v-card-text>
          <CorrespondenceForm v-model="current" :contacts="contacts" @submit="save" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'
import DataTable from '../components/common/DataTable.vue'
import CorrespondenceForm from '../components/correspondence/CorrespondenceForm.vue'
import { getCorrespondence, createCorrespondence, updateCorrespondence, deleteCorrespondence } from '../services/api'
import axios from 'axios'

const auth = useAuthStore()
const ui = useUiStore()

// Table headers
const headers = [
  { title: 'Contact', key: 'contact_name' },
  { title: 'Type', key: 'type' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Outcome', key: 'outcome' },
  { title: 'Created By', key: 'created_by_username' },
  { title: 'Duration', key: 'duration' },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// State
const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 15, search: '' })

// Contacts
const contacts = ref<{ label: string; value: number }[]>([])
const loadingContacts = ref(false)

// Modal state
const dialog = ref(false)
const current = ref<any>(null)

/**
 * Utility: resolve contact name by ID
 */
function resolveContactName(contactId: number, fallback?: string): string {
  const found = contacts.value.find(c => c.value === contactId)
  return found ? found.label : (fallback || '-')
}

/**
 * Load contacts from backend
 */
async function loadContacts() {
  loadingContacts.value = true
  try {
    const { data } = await axios.get('/api/contacts/', { headers: auth.authHeader })
    contacts.value = data.contacts?.map((c: any) => ({
      label: c.name,
      value: c.id
    })) || []
  } finally {
    loadingContacts.value = false
  }
}

/**
 * Load correspondence for table
 */
async function reload() {
  loading.value = true
  try {
    const params: any = { page: query.page, rows: query.pageSize }
    if (query.search) params.search = query.search

    const data = await getCorrespondence(params, auth.authHeader)
    const correspondenceArray = data.correspondence || []

    items.value = correspondenceArray.map((r: any) => ({
      ...r,
      contact_name: resolveContactName(r.contact, r.contact_name)
    }))

    total.value = data.total ?? items.value.length
  } finally {
    loading.value = false
  }
}

/**
 * Modal open (create)
 */
function openCreate() {
  current.value = {
    contact: contacts.value[0]?.value || null, // store as ID
    type: 'call',
    notes: '',
    outcome: '',
    duration: null
  }
  dialog.value = true
}

/**
 * Modal edit
 */
function edit(item: any) {
  current.value = {
    ...item,
    contact: typeof item.contact === 'object' ? item.contact.value : item.contact // ensure ID
  }
  dialog.value = true
}

/**
 * Save correspondence
 */
async function save() {
  const payload = { ...current.value }

  // Ensure contact is always stored as ID
  const contactId = typeof payload.contact === 'object' ? payload.contact.value : payload.contact
  payload.contact = contactId

  // Derive display label
  const contactLabel = resolveContactName(contactId, payload.contact_name)

  try {
    if (payload.id) {
      await updateCorrespondence(payload, auth.authHeader)
      const idx = items.value.findIndex(i => i.id === payload.id)
      if (idx >= 0) {
        items.value[idx] = { ...payload, contact_name: contactLabel }
      }
      ui.toast('Saved', 'success')
    } else {
      const created = await createCorrespondence(payload, auth.authHeader)
      items.value.unshift({ ...created, contact_name: contactLabel })
      total.value++
      ui.toast('Created', 'success')
    }
  } catch {
    ui.toast('Operation failed', 'error')
  } finally {
    dialog.value = false
  }
}

/**
 * Delete correspondence
 */
async function tryDelete(item: any) {
  const confirm = await ui.ask('Delete Correspondence', `Delete "${item.notes}"?`)
  if (!confirm) return
  const backup = [...items.value]
  items.value = items.value.filter(i => i.id !== item.id)
  total.value--
  try {
    await deleteCorrespondence(item.id, auth.authHeader)
    ui.toast('Deleted', 'success')
  } catch {
    items.value = backup
    total.value++
    ui.toast('Delete failed', 'error')
  }
}

/**
 * Handle table query updates
 */
function onQuery(q: { page: number; pageSize: number; search: string }) {
  query.page = q.page
  query.pageSize = q.pageSize
  query.search = q.search
  reload()
}

/**
 * Initial load
 */
onMounted(async () => {
  await loadContacts()
  reload()
})
</script>
