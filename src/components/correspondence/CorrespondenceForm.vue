<template>
  <v-form @submit.prevent="onSubmit" v-model="valid">
    <!-- Contact select -->
    <EntitySelect
      label="Contact"
      :items="contacts"
      v-model="form.contact"
      title-field="label"
      value-field="value"
      :loading="loadingContacts"
      placeholder="Select a contact"
      :rules="[r.required]"
    />

    <!-- Type select -->
    <v-select
      v-model="form.type"
      :items="types"
      label="Type"
      item-title="label"
      item-value="value"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
    />

    <!-- Outcome -->
    <v-text-field
      v-model="form.outcome"
      label="Outcome"
      variant="outlined"
      density="comfortable"
    />

    <!-- Duration -->
    <v-text-field
      v-model.number="form.duration"
      label="Duration (min)"
      type="number"
      variant="outlined"
      density="comfortable"
    />

    <!-- Notes -->
    <v-textarea
      v-model="form.notes"
      label="Notes"
      variant="outlined"
      density="comfortable"
      rows="4"
    />

    <FormActions :loading="loading" @cancel="$emit('cancel')" />
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import EntitySelect from '../common/EntitySelect.vue'
import FormActions from '../common/FormActions.vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'

const props = defineProps<{ modelValue?: any; contacts?: any[] }>()
const emit = defineEmits<{ (e:'submit', v:any): void; (e:'cancel'): void }>()
const auth = useAuthStore()

// Validation
const r = { required: (v:any) => !!v || 'Required' }
const valid = ref(false)
const loading = ref(false)
const loadingContacts = ref(false)

// Form state
const form = reactive<any>({
  contact: null,
  type: 'call',
  notes: '',
  outcome: '',
  duration: null
})

// Type options
const types = [
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'call' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Text', value: 'text' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Other', value: 'other' }
]

// Contacts for dropdown
const contacts = ref<any[]>(props.contacts?.map(c => ({ label: c.name, value: c.id })) || [])

// Sync with parent v-model
watch(
  () => props.modelValue,
  (v) => { if (v) Object.assign(form, v) },
  { immediate: true }
)

// Load contacts if not passed
onMounted(async () => {
  if (!contacts.value.length) {
    loadingContacts.value = true
    try {
      const { data } = await axios.get('/api/contacts/', { headers: auth.authHeader })
      contacts.value = data.contacts.map((c:any) => ({ label: c.name, value: c.id })) || []
    } finally {
      loadingContacts.value = false
    }
  }
})

// Submit form
function onSubmit() {
  emit('submit', {
    contact: form.contact,
    type: form.type,
    notes: form.notes?.trim(),
    outcome: form.outcome?.trim(),
    duration: form.duration
  })
}
</script>
