<template>
  <div>
    <!-- Leads Table -->
    <DataTable
      title="Leads"
      :headers="headers"
      :items="items"
      :total="total"
      :loading="loading"
      :page-size="query.pageSize"
      search-label="Search leads"
      @update:query="onQuery"
    >
      <!-- Filters -->
      <template #filters>
        <v-select
          v-model="filters.status"
          :items="statuses"
          label="Filter by Status"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mr-3"
          style="max-width: 220px"
          @update:modelValue="reload"
        />
      </template>

      <!-- Row Actions -->
      <template #row-actions="{ item }">
        <div class="d-flex align-center gap-1">
          <v-tooltip text="View lead">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                icon="mdi-eye"
                variant="text"
                color="primary"
                @click.stop="router.push(`/leads/${item.id}`)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Edit lead">
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

          <v-tooltip text="Delete lead">
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

    <!-- Create/Edit Lead Dialog -->
    <v-dialog v-model="dialog" max-width="640" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          {{ current?.id ? "Edit Lead" : "New Lead" }}
        </v-card-title>

        <v-divider />

        <v-card-text>
          <LeadForm v-model="current" @submit="save" @cancel="closeDialog" />
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

import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import DataTable from "../components/common/DataTable.vue"
import LeadForm from "../components/leads/LeadForm.vue"
import { useAuthStore } from "../store/auth"
import { useUiStore } from "../store/ui"
import {
  listLeads,
  createLead as apiCreateLead,
  updateLead as apiUpdateLead,
  deleteLead as apiDeleteLead,
} from "../services/endpoints"

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const isAgent = auth.role === "AGENT"

const headers = [
  { title: "Name", key: "name" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Value", key: "value" },
  { title: "Actions", key: "actions", sortable: false, width: 160 },
]

const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 15, search: "" })
const filters = reactive({
  search: "",
  status: "" as "" | "NEW" | "IN_PROGRESS" | "WON" | "LOST",
})
const statuses = ["NEW", "IN_PROGRESS", "WON", "LOST"]

const dialog = ref(false)
const current = ref<any>(null)

function onQuery(q: { page: number; pageSize: number; search: string }) {
  Object.assign(query, q)
  reload()
}

async function reload() {
  loading.value = true
  try {
    const params: any = { page: query.page, rows: query.pageSize }
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status

    const data = await listLeads(params, auth.authHeader)
    items.value = Array.isArray(data?.results) ? data.results : []
    total.value = typeof data?.count === "number" ? data.count : 0
  } finally {
    loading.value = false
  }
}

function openCreate() {
  current.value = { status: "NEW" }
  dialog.value = true
}
function edit(item: any) {
  current.value = { ...item }
  dialog.value = true
}
function closeDialog() {
  dialog.value = false
}

async function save(payload: any) {
  if (!Array.isArray(items.value)) items.value = []

  if (current.value?.id) {
    const optimistic = items.value.map((i) =>
      i.id === current.value.id ? { ...i, ...payload } : i
    )
    items.value = optimistic
    try {
      await apiUpdateLead(
        current.value.id,
        { ...current.value, ...payload },
        auth.authHeader
      )
      ui.toast("Saved", "success")
    } catch {
      ui.toast("Save failed", "error")
      await reload()
    }
  } else {
    const temp = { id: `temp-${Date.now()}`, ...payload }
    items.value = [temp, ...items.value]
    try {
      await apiCreateLead(payload, auth.authHeader)
      ui.toast("Created", "success")
      await reload()
    } catch {
      ui.toast("Create failed", "error")
      items.value = items.value.filter((i) => i !== temp)
    }
  }
  dialog.value = false
}

async function tryDelete(item: any) {
  if (isAgent) return
  const ok = await ui.ask("Delete lead", `Are you sure you want to delete "${item.name}"?`)
  if (!ok) return

  const backup = [...items.value]
  items.value = items.value.filter((i) => i.id !== item.id)

  try {
    await apiDeleteLead(item.id, auth.authHeader)
    ui.toast("Deleted", "success")
  } catch {
    ui.toast("Delete failed", "error")
    items.value = backup
  }
}

onMounted(reload)
</script>
