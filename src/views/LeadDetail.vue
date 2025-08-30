<template>
  <div>
    <!-- Lead Info Card -->
    <v-card class="mb-6">
      <v-toolbar flat>
        <v-toolbar-title>Lead Information</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" @click="saveLead" :loading="saving">Save</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lead.name"
              label="Name"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="statuses"
              v-model="lead.status"
              label="Status"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabs -->
    <v-tabs v-model="tab" bg-color="transparent" color="primary" class="mb-4">
      <v-tab value="notes">Notes</v-tab>
      <v-tab value="reminders">Reminders</v-tab>
      <v-tab value="correspondence">Correspondence</v-tab>
      <v-tab value="history">History</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Notes Tab -->
      <v-window-item value="notes">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Notes</v-toolbar-title>
            <v-spacer />
            <v-btn variant="tonal" @click="openNoteDialog">Add Note</v-btn>
            <v-btn
              class="ml-2"
              :loading="loadingSummary"
              @click="generateSummary"
            >
              Summary
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-alert
              v-if="summary"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              {{ summary }}
            </v-alert>
            <v-list two-line>
              <v-list-item
                v-for="n in notes"
                :key="n.id"
                class="mb-2"
                rounded
                elevation="1"
              >
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ n.content }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    <span>By {{ n.created_by_username }}</span>
                    <span>{{ formatDate(n.created_at) }}</span>
                  </v-list-item-subtitle>
                  <v-chip
                    small
                    color="primary"
                    text-color="white"
                    class="mt-1"
                  >
                    {{ noteTypeLabel(n.note_type) }}
                  </v-chip>
                </v-list-item-content>
                <template #append>
                  <v-btn
                    size="small"
                    icon="mdi-pencil"
                    variant="text"
                    @click="editNoteDialog(n)"
                  />
                  <v-btn
                    size="small"
                    icon="mdi-delete"
                    color="error"
                    variant="text"
                    @click="deleteNoteHandler(n)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Reminders Tab -->
      <v-window-item value="reminders">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Reminders</v-toolbar-title>
            <v-spacer />
            <v-btn variant="tonal" @click="openReminderDialog">Add Reminder</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-list two-line>
              <v-list-item
                v-for="r in reminders"
                :key="r.id"
                class="mb-2"
                rounded
                elevation="1"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ r.message }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Scheduled: {{ formatDate(r.scheduled_time) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <template #append>
                  <v-btn
                    size="small"
                    icon="mdi-pencil"
                    variant="text"
                    @click="editReminderDialog(r)"
                  />
                  <v-btn
                    size="small"
                    icon="mdi-delete"
                    color="error"
                    variant="text"
                    @click="deleteReminderHandler(r)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Correspondence Tab -->
      <v-window-item value="correspondence">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Correspondence</v-toolbar-title>
            <v-spacer />
            <v-btn variant="tonal" @click="openCorrespondenceDialog">
              Add Entry
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-list two-line>
              <v-list-item
                v-for="c in correspondence"
                :key="c.id"
                class="mb-2"
                rounded
                elevation="1"
              >
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ c.type }} — {{ c.notes }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    With {{ c.contact_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <template #append>
                  <v-btn
                    size="small"
                    icon="mdi-pencil"
                    variant="text"
                    @click="editCorrespondenceDialog(c)"
                  />
                  <v-btn
                    size="small"
                    icon="mdi-delete"
                    color="error"
                    variant="text"
                    @click="deleteCorrespondenceHandler(c)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- History Tab -->
      <v-window-item value="history">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>History</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-timeline density="compact">
              <v-timeline-item
                v-for="a in audit"
                :key="a.id"
                :dot-color="'primary'"
                icon="mdi-history"
              >
                <div class="text-body-2">
                  <strong>{{ a.user }}</strong> {{ a.action }} {{ a.field }} →
                  {{ a.value }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(a.timestamp) }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Modals -->
    <FormModal
      v-model="noteDialog"
      title="Note"
      primary-text="Save"
      @save="saveNoteHandler"
    >
      <v-form>
        <v-textarea
          v-model="noteForm.content"
          label="Content"
          rows="3"
          required
        />
        <v-select
          v-model="noteForm.note_type"
          :items="noteTypes"
          item-title="label"
          item-value="value"
          label="Note Type"
          required
        />
      </v-form>
    </FormModal>

    <FormModal
      v-model="reminderDialog"
      title="Reminder"
      primary-text="Save"
      @save="saveReminderHandler"
    >
      <ReminderForm v-model="reminderForm" @submit="saveReminderHandler" />
    </FormModal>

    <FormModal
      v-model="corrDialog"
      title="Correspondence"
      primary-text="Save"
      @save="saveCorrespondenceHandler"
    >
      <CorrespondenceForm v-model="corrForm" @submit="saveCorrespondenceHandler" />
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";
import FormModal from "../components/common/FormModal.vue";
import ReminderForm from "../components/reminders/ReminderForm.vue";
import CorrespondenceForm from "../components/correspondence/CorrespondenceForm.vue";
import {
  retrieveLead,
  updateLead,
  leadSummary,
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  listCorrespondence,
  createCorrespondence,
  updateCorrespondence,
  deleteCorrespondence,
} from "../services/endpoints";

const route = useRoute();
const auth = useAuthStore();

const lead = ref<any>({});
const saving = ref(false);
const tab = ref("notes");
const summary = ref("");
const loadingSummary = ref(false);

const notes = ref<any[]>([]);
const reminders = ref<any[]>([]);
const correspondence = ref<any[]>([]);
const audit = ref<any[]>([]);

const noteDialog = ref(false);
const reminderDialog = ref(false);
const corrDialog = ref(false);

const noteForm = ref<any>({ content: "", note_type: "GENERAL" });
const reminderForm = ref<any>({ message: "", scheduled_time: "" });
const corrForm = ref<any>({ type: "call", notes: "" });

const statuses = ["NEW", "IN_PROGRESS", "WON", "LOST"];
const noteTypes = [
  { value: "GENERAL", label: "General" },
  { value: "CALL", label: "Call Note" },
  { value: "MEETING", label: "Meeting Note" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "OPPORTUNITY", label: "Opportunity" },
];

function noteTypeLabel(value: string) {
  const item = noteTypes.find((n) => n.value === value);
  return item ? item.label : value;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", { hour12: true });
}

/** Load lead & related data */
async function loadLeadData() {
  const id = route.params.id as string;
  lead.value = await retrieveLead(id, auth.authHeader);
  await Promise.all([loadNotes(), loadReminders(), loadCorrespondence()]);
}

/** Save lead changes */
async function saveLead() {
  saving.value = true;
  try {
    await updateLead(lead.value.id, lead.value, auth.authHeader);
  } finally {
    saving.value = false;
  }
}

/** Generate AI summary */
async function generateSummary() {
  if (!lead.value?.id) return;
  loadingSummary.value = true;
  try {
    const data = await leadSummary(lead.value.id, auth.authHeader);
    summary.value = (data as any).summary || "";
  } finally {
    loadingSummary.value = false;
  }
}

/** Notes CRUD */
async function loadNotes() {
  const data = await listNotes({ lead: lead.value.id }, auth.authHeader);
  notes.value = (data.notes || []).map((n: any) => ({
    ...n,
  }));
}
function openNoteDialog() {
  noteForm.value = { content: "", note_type: "GENERAL" };
  noteDialog.value = true;
}
function editNoteDialog(n: any) {
  noteForm.value = { ...n };
  noteDialog.value = true;
}
async function saveNoteHandler() {
  if (!noteForm.value.content) return;
  if (noteForm.value.id) {
    const updated = await updateNote(
      noteForm.value.id,
      { ...noteForm.value },
      auth.authHeader
    );
    const idx = notes.value.findIndex((n) => n.id === updated.id);
    if (idx >= 0) notes.value[idx] = updated;
  } else {
    const created = await createNote(
      { lead: lead.value.id, ...noteForm.value },
      auth.authHeader
    );
    notes.value.unshift(created);
  }
  noteDialog.value = false;
}
async function deleteNoteHandler(n: any) {
  await deleteNote(n.id, auth.authHeader);
  notes.value = notes.value.filter((x) => x.id !== n.id);
}

/** Reminders CRUD */
async function loadReminders() {
  const data = await listReminders({ lead: lead.value.id }, auth.authHeader);
  reminders.value = data.results || [];
}
function openReminderDialog() {
  reminderForm.value = { message: "", scheduled_time: new Date().toISOString() };
  reminderDialog.value = true;
}
function editReminderDialog(r: any) {
  reminderForm.value = { ...r };
  reminderDialog.value = true;
}
async function saveReminderHandler() {
  if (reminderForm.value.id) {
    const updated = await updateReminder(
      reminderForm.value.id,
      reminderForm.value,
      auth.authHeader
    );
    const idx = reminders.value.findIndex((r) => r.id === updated.id);
    if (idx >= 0) reminders.value[idx] = updated;
  } else {
    const created = await createReminder(
      { lead: lead.value.id, ...reminderForm.value },
      auth.authHeader
    );
    reminders.value.unshift(created);
  }
  reminderDialog.value = false;
}
async function deleteReminderHandler(r: any) {
  await deleteReminder(r.id, auth.authHeader);
  reminders.value = reminders.value.filter((x) => x.id !== r.id);
}

/** Correspondence CRUD */
async function loadCorrespondence() {
  const data = await listCorrespondence({ lead: lead.value.id }, auth.authHeader);
  correspondence.value = (data.correspondence || []).map((c: any) => ({ ...c }));
}
function openCorrespondenceDialog() {
  corrForm.value = { type: "call", notes: "" };
  corrDialog.value = true;
}
function editCorrespondenceDialog(c: any) {
  corrForm.value = { ...c };
  corrDialog.value = true;
}
async function saveCorrespondenceHandler() {
  const contactId = lead.value.contacts?.[0]?.id || corrForm.value.contact;
  if (corrForm.value.id) {
    const updated = await updateCorrespondence(
      corrForm.value.id,
      corrForm.value,
      auth.authHeader
    );
    const idx = correspondence.value.findIndex((c) => c.id === updated.id);
    if (idx >= 0) correspondence.value[idx] = updated;
  } else {
    const created = await createCorrespondence(
      { contact: contactId, ...corrForm.value },
      auth.authHeader
    );
    correspondence.value.unshift(created);
  }
  corrDialog.value = false;
}
async function deleteCorrespondenceHandler(c: any) {
  await deleteCorrespondence(c.id, auth.authHeader);
  correspondence.value = correspondence.value.filter((x) => x.id !== c.id);
}

onMounted(loadLeadData);
</script>
