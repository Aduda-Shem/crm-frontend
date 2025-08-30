<template>
  <div class="pa-4">
    <!-- Contacts Table -->
    <DataTable
      title="Contacts"
      :headers="headers"
      :items="items"
      :total="total"
      :loading="loading"
      :page-size="query.pageSize"
      search-label="Search contacts"
      @update:query="onQuery"
    >
      <!-- Row Actions -->
      <template #row-actions="{ item }">
        <div class="d-flex align-center gap-1">
          <v-tooltip text="Edit contact">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                icon="mdi-pencil"
                variant="text"
                color="info"
                @click.stop="edit(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Delete contact">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                icon="mdi-delete"
                variant="text"
                color="error"
                :disabled="isAgent"
                @click.stop="tryDelete(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </DataTable>

    <!-- Create/Edit Contact Dialog -->
    <v-dialog v-model="dialog" max-width="640" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          {{ current?.id ? "Edit Contact" : "New Contact" }}
        </v-card-title>

        <v-divider />

        <v-card-text>
          <ContactForm v-model="current" @submit="save" @cancel="closeDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Floating Add Button -->
    <v-btn
      color="primary"
      elevation="6"
      class="position-fixed"
      style="right:24px; bottom:24px"
      icon="mdi-plus"
      size="large"
      @click="openCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import DataTable from '../components/common/DataTable.vue'
import ContactForm from '../components/contacts/ContactForm.vue'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'
import { listContacts, createContact, updateContact, deleteContact } from '../services/endpoints'

const auth = useAuthStore()
const ui = useUiStore()
const isAgent = auth.role === 'AGENT'

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Lead', key: 'lead_name' },
  { title: 'Actions', key: 'actions', sortable: false, width: 140 },
]

// State
const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 15, search: '' })

// Dialog state
const dialog = ref(false)
const current = ref<any>(null)

// Fetch contacts
async function reload() {
  loading.value = true
  try {
    const params: any = { page: query.page, rows: query.pageSize }
    if (query.search) params.search = query.search

    const data = await listContacts(params, auth.authHeader)
    items.value = Array.isArray(data.results)
      ? data.results.map(c => ({
          ...c,
          lead_name: c.linked_lead_name || '-',
          lead: c.linked_lead || null
        }))
      : []
    total.value = data.count || items.value.length
  } finally {
    loading.value = false
  }
}

// Pagination & search
function onQuery(q: { page: number; pageSize: number; search: string }) {
  Object.assign(query, q)
  reload()
}

// Dialog handlers
function openCreate() {
  current.value = { name: '', email: '', lead: null }
  dialog.value = true
}
function edit(item: any) {
  current.value = { ...item }
  dialog.value = true
}
function closeDialog() { dialog.value = false }

// Save contact
async function save(payload: any) {
  try {
    if (current.value?.id) {
      await updateContact(current.value.id, { ...current.value, ...payload }, auth.authHeader)
      ui.toast('Saved', 'success')
    } else {
      await createContact({ ...current.value, ...payload }, auth.authHeader)
      ui.toast('Created', 'success')
    }
    await reload()
    dialog.value = false
  } catch {
    ui.toast('Operation failed', 'error')
  }
}

// Delete contact
async function tryDelete(item: any) {
  if (isAgent) return
  const ok = await ui.ask('Delete contact', `Are you sure you want to delete "${item.name}"?`)
  if (!ok) return

  const backup = [...items.value]
  items.value = items.value.filter(i => i.id !== item.id)

  try {
    await deleteContact(item.id, auth.authHeader)
    ui.toast('Deleted', 'success')
  } catch {
    ui.toast('Delete failed', 'error')
    items.value = backup
  }
}

onMounted(reload)
</script>
