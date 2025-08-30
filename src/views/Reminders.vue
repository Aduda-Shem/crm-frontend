<template>
  <div>
    <!-- Reminders Table -->
    <DataTable
      title="Reminders"
      :headers="headers"
      :items="items"
      :total="total"
      :loading="loading"
      :page-size="query.pageSize"
      search-label="Search reminders"
      @update:query="onQuery"
    >
      <template #row-actions="{ item }">
        <v-btn
          size="small"
          icon="mdi-pencil"
          variant="text"
          @click.stop="edit(item)"
        />
        <v-btn
          size="small"
          icon="mdi-delete"
          variant="text"
          color="error"
          :disabled="isAgent"
          @click.stop="tryDelete(item)"
        />
      </template>
    </DataTable>

    <!-- Floating Add Button -->
    <v-btn
      color="primary"
      class="position-fixed"
      style="right: 24px; bottom: 24px"
      icon="mdi-plus"
      @click="openCreate"
    />

    <!-- Reminder Modal -->
    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title>{{
          current?.id ? "Edit Reminder" : "New Reminder"
        }}</v-card-title>
        <v-card-text>
          <ReminderForm
            v-model="current"
            :leads="leads"
            @submit="save"
            @cancel="dialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import { useUiStore } from "../store/ui";
import DataTable from "../components/common/DataTable.vue";
import ReminderForm from "../components/reminders/ReminderForm.vue";
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "../services/api";
import axios from "axios";

const auth = useAuthStore();
const ui = useUiStore();
const isAgent = auth.role === "AGENT";

// Table headers
const headers = [
  { title: "Message", key: "message" },
  { title: "Scheduled", key: "scheduled_time" },
  { title: "Lead", key: "lead_name" },
  { title: "Type", key: "reminder_type" },
  { title: "Actions", key: "actions", sortable: false, width: 120 },
];

const items = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const query = reactive({ page: 1, pageSize: 10, search: "" });

// Leads
const leads = ref<{ label: string; value: number }[]>([]);
const loadingLeads = ref(false);

// Modal
const dialog = ref(false);
const current = ref<any>(null);

/** Load leads for dropdown */
async function loadLeads() {
  loadingLeads.value = true;
  try {
    const { data } = await axios.get("/api/leads/", {
      headers: auth.authHeader,
    });
    leads.value =
      data.leads.map((l: any) => ({ label: l.name, value: l.id })) || [];
  } finally {
    loadingLeads.value = false;
  }
}

/** Load reminders */
async function reload() {
  loading.value = true;
  try {
    const data = await getReminders(
      { page: query.page, rows: query.pageSize, search: query.search },
      auth.authHeader
    );
    items.value = Array.isArray(data.reminders)
      ? data.reminders.map((r: any) => ({
          ...r,
          lead_name:
            r.lead_name ||
            leads.value.find((l) => l.value === r.lead_id)?.label ||
            "-",
        }))
      : [];
    total.value = data.total ?? items.value.length;
  } finally {
    loading.value = false;
  }
}

/** Open modal */
function openCreate() {
  current.value = {
    message: "",
    scheduled_time: new Date().toISOString().slice(0, 16),
    lead_id: leads.value[0]?.value || null,
    reminder_type: "FOLLOW_UP",
  };
  dialog.value = true;
}

function edit(item: any) {
  current.value = { ...item };
  dialog.value = true;
}

/** Save reminder */
async function save(payload: any) {
  try {
    if (payload.id) {
      await updateReminder(payload, auth.authHeader);
      const idx = items.value.findIndex((i) => i.id === payload.id);
      if (idx >= 0)
        items.value[idx] = {
          ...payload,
          lead_name:
            leads.value.find((l) => l.value === payload.lead_id)?.label || "-",
        };
      ui.toast("Saved", "success");
    } else {
      const created = await createReminder(payload, auth.authHeader);
      items.value.unshift({
        ...created,
        lead_name:
          created.lead_name ||
          leads.value.find((l) => l.value === created.lead_id)?.label ||
          "-",
      });
      total.value++;
      ui.toast("Created", "success");
    }
  } catch {
    ui.toast("Operation failed", "error");
  } finally {
    dialog.value = false;
  }
}

/** Delete reminder */
async function tryDelete(item: any) {
  if (isAgent) return;
  const confirm = await ui.ask(
    "Delete reminder",
    `Delete reminder "${item.message}"?`
  );
  if (!confirm) return;

  const backup = [...items.value];
  items.value = items.value.filter((i) => i.id !== item.id);
  total.value--;

  try {
    await deleteReminder(item.id, auth.authHeader);
    ui.toast("Deleted", "success");
  } catch {
    items.value = backup;
    total.value++;
    ui.toast("Delete failed", "error");
  }
}

/** Table query */
function onQuery(q: { page: number; pageSize: number; search: string }) {
  query.page = q.page;
  query.pageSize = q.pageSize;
  query.search = q.search;
  reload();
}

onMounted(async () => {
  await loadLeads();
  reload();
});
</script>
