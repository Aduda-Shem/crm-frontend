<template>
  <v-form @submit.prevent="onSubmit" v-model="valid">
    <v-text-field
      v-model="form.name"
      label="Name"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
    />
    <v-text-field
      v-model="form.email"
      label="Email"
      variant="outlined"
      density="comfortable"
      :rules="[r.email]"
    />
    <v-text-field
      v-model="form.phone"
      label="Phone"
      variant="outlined"
      density="comfortable"
    />
    <!-- Lead select -->
    <EntitySelect
      label="Lead"
      :items="leads"
      v-model="form.linked_lead"
      title-field="name"
      value-field="id"
      :loading="loadingLeads"
      placeholder="Select a lead"
    />
    <v-text-field
      v-model="form.title"
      label="Title"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="form.company"
      label="Company"
      variant="outlined"
      density="comfortable"
    />
    <v-switch
      v-model="form.is_primary"
      label="Primary contact"
      density="comfortable"
      inset
    />
    <FormActions :loading="loading" @cancel="$emit('cancel')" />
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
import EntitySelect from '../common/EntitySelect.vue'
import FormActions from '../common/FormActions.vue'
import { useAuthStore } from '../../store/auth'

const props = defineProps<{ modelValue?: any }>()
const emit = defineEmits<{ (e:'submit', v:any): void; (e:'cancel'): void }>()
const auth = useAuthStore()

const r = {
  required: (v:any) => !!v || 'Required',
  email: (v:any) => !v || /.+@.+\..+/.test(v) || 'Invalid email'
}

const valid = ref(false)
const loading = ref(false)
const loadingLeads = ref(false)
const form = reactive<any>({
  name: '',
  email: '',
  phone: '',
  linked_lead: null,
  title: '',
  company: '',
  is_primary: false
})
const leads = ref<any[]>([])

// Populate form from v-model
watch(
  () => props.modelValue,
  (v) => { Object.assign(form, v || {}) },
  { immediate: true }
)

// Fetch leads
async function loadLeads() {
  loadingLeads.value = true
  try {
    const { data } = await axios.get('/api/leads/', { headers: auth.authHeader })
    leads.value = data.leads || []
  } finally {
    loadingLeads.value = false
  }
}

function onSubmit() {
  emit('submit', { ...form })
}

onMounted(() => {
  loadLeads()
})
</script>
