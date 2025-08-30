<template>
  <div>
    <DataTable
      title="Audit Trail"
      :headers="headers"
      :items="items"
      :total="total"
      :loading="loading"
      :page-size="query.pageSize"
      search-label="Search audit"
      @update:query="onQuery"
    >
      <!-- Use row-actions slot for the View links -->
      <template #row-actions="{ item }">
        <span v-if="item.old_value">
          <a href="#" @click.prevent="openValueDialog(item.old_value, 'Old Value')">View Old</a>
        </span>
        &nbsp;|&nbsp;
        <span v-if="item.new_value">
          <a href="#" @click.prevent="openValueDialog(item.new_value, 'New Value')">View New</a>
        </span>
      </template>
    </DataTable>

    <!-- Dialog for full value -->
    <v-dialog v-model="valueDialog" max-width="600">
      <v-card>
        <v-card-title>{{ valueDialogTitle }}</v-card-title>
        <v-divider />
        <v-card-text>
          <pre style="white-space: pre-wrap; word-break: break-word;">
{{ valueDialogContent }}
          </pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="valueDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import DataTable from "../components/common/DataTable.vue";
import { listAudit } from "../services/endpoints.ts";

const headers = [
  { title: "User", key: "user" },
  { title: "Action", key: "action" },
  { title: "Entity", key: "model" },
  { title: "Old Value", key: "old_value" },
  { title: "New Value", key: "new_value" },
  { title: "Time", key: "timestamp" },
  { title: "IP", key: "ip_address" },
];

const items = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const query = reactive({ page: 1, pageSize: 10, search: "" });
const filters = reactive({ user: "", model: "", action: "" });

const valueDialog = ref(false);
const valueDialogContent = ref("");
const valueDialogTitle = ref("");

function openValueDialog(value: any, title: string) {
  try {
    const obj = typeof value === "string" ? JSON.parse(value) : value;
    valueDialogContent.value = JSON.stringify(obj, null, 2);
  } catch {
    valueDialogContent.value = String(value);
  }
  valueDialogTitle.value = title;
  valueDialog.value = true;
}

function formatDate(ts: string) {
  if (!ts) return "—";
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function onQuery(q: { page: number; pageSize: number; search: string }) {
  Object.assign(query, q);
  reload();
}

async function reload() {
  loading.value = true;
  try {
    const auth = useAuthStore();
    const params: any = { page: query.page, rows: query.pageSize };
    if (query.search) params.search = query.search;
    if (filters.user) params.user = filters.user;
    if (filters.model) params.model = filters.model;
    if (filters.action) params.action = filters.action;

    const data = await listAudit(params, auth.authHeader);
    items.value = Array.isArray(data?.results) ? data.results : [];
    total.value = typeof data?.count === "number" ? data.count : 0;
  } finally {
    loading.value = false;
  }
}

onMounted(reload);
</script>
