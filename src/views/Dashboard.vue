<template>
  <v-container fluid class="dashboard-container">
    <!-- Header -->
    <v-row class="align-center mb-6">
      <v-col cols="12" md="8">
        <div class="page-title">
          <h1 class="title">Dashboard Overview</h1>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn icon @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stat cards -->
    <v-row dense>
      <v-col cols="12" sm="6" md="3" v-for="card in statCards" :key="card.key">
        <v-card class="pa-4 stat-card">
          <div class="stat-top">
            <div class="stat-label">{{ card.label }}</div>
            <v-icon size="24">{{ card.icon }}</v-icon>
          </div>
          <div class="stat-value">{{ card.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row class="mt-6" dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4 chart-card">
          <h3 class="chart-title">Leads by Status</h3>
          <donut-chart :data="charts.leads_by_status" />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 chart-card">
          <h3 class="chart-title">Reminders by Status</h3>
          <donut-chart :data="charts.reminders_by_status" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Audit Log Table -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="pa-4 audit-card">
          <h3>Recent Audit Entries ({{ counts.audit_entries_total }})</h3>
          <v-simple-table dense>
            <thead>
              <tr>
                <th class="text-left">User</th>
                <th class="text-left">Action</th>
                <th class="text-left">Model</th>
                <th class="text-left">Object ID</th>
                <th class="text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in recent.audit_entries" :key="entry.id">
                <td>{{ entry.user }}</td>
                <td>{{ entry.action }}</td>
                <td>{{ entry.model }}</td>
                <td>{{ entry.object_id }}</td>
                <td>{{ formatDate(entry.created_at) }}</td>
              </tr>
              <tr v-if="recent.audit_entries.length === 0">
                <td colspan="5" class="text-center text-caption">
                  No audit entries yet.
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import api from "../services/api";
import { useAuthStore } from "../store/auth";
import DonutChart from "../components/common/DonutChart.vue";

const auth = useAuthStore();
const snackbar = ref({ show: false, message: "", color: "" });

// Counts
const counts = reactive({
  leads_total: 0,
  contacts_total: 0,
  notes_total: 0,
  reminders_total: 0,
  correspondence_total: 0,
  audit_entries_total: 0,
});

// Recent data
const recent = reactive({
  leads: [],
  contacts: [],
  notes: [],
  reminders: [],
  correspondence: [],
  audit_entries: [],
});

// Charts
const charts = reactive({
  leads_by_status: [],
  reminders_by_status: [],
});

// Stat cards
const statCards = reactive([
  { key: "leads", label: "Leads", value: counts.leads_total, icon: "mdi-account-multiple" },
  { key: "contacts", label: "Contacts", value: counts.contacts_total, icon: "mdi-account" },
  { key: "reminders", label: "Reminders", value: counts.reminders_total, icon: "mdi-bell-outline" },
  { key: "audit_entries", label: "Audit Entries", value: counts.audit_entries_total, icon: "mdi-file-document-outline" },
]);

// Auth headers
function headersAuth() {
  return auth?.authHeader || {};
}

// Fetch dashboard data
async function fetchDashboard() {
  try {
    const res = await api.get("/dashboard/", { headers: headersAuth() });
    Object.assign(counts, res.data.counts);
    Object.assign(recent, res.data.recent);
    Object.assign(charts, res.data.charts);

    // Update stat card values
    statCards.forEach(
      (card) => (card.value = counts[card.key] ?? counts[`${card.key}_total`] ?? 0)
    );
  } catch (err: any) {
    console.error(err);
    snackbar.value = { show: true, message: "Failed to fetch dashboard", color: "error" };
  }
}

// Refresh handler
function refresh() {
  fetchDashboard();
}

// Format ISO date
function formatDate(dateStr: string) {
  return dateStr ? new Date(dateStr).toLocaleString() : "-";
}

onMounted(fetchDashboard);
</script>

<style scoped lang="scss">
.dashboard-container {
  .stat-card {
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 12px;
    transition: transform 0.2s ease;
    &:hover { transform: translateY(-2px); }
  }
  .stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .stat-label { color: #6b7280; font-weight: 500; }
  .stat-value { margin-top: 8px; font-weight: 600; font-size: 1.6rem; color: #111827; }

  .chart-card { border-radius: 12px; min-height: 300px; }
  .chart-title { margin-bottom: 16px; color: #111827; font-weight: 600; }

  .audit-card { border-radius: 12px; overflow-x: auto; }
  table { width: 100%; }
  th { color: #6b7280; font-weight: 500; }
  td { font-weight: 400; color: #111827; }
}
</style>
