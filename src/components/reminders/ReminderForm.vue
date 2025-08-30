<template>
  <v-form ref="formRef" @submit.prevent="onSubmit" v-model="valid">
    <!-- Lead select -->
    <v-select
      label="Lead"
      :items="leads"
      v-model="form.lead_id"
      item-title="label"
      item-value="value"
      :loading="loadingLeads"
      placeholder="Select a lead"
      :rules="[r.required]"
      outlined
    />

    <!-- Reminder Type -->
    <v-select
      v-model="form.reminder_type"
      :items="types"
      label="Reminder Type"
      item-title="label"
      item-value="value"
      :rules="[r.required]"
      outlined
    />

    <!-- Message -->
    <v-text-field
      v-model="form.message"
      label="Message"
      :rules="[r.required]"
      outlined
    />

    <!-- Scheduled Time -->
    <v-text-field
      v-model="form.scheduled_time"
      label="Scheduled Time"
      type="datetime-local"
      :min="minDateTime"
      :rules="[r.required, validateFutureDate]"
      outlined
    />

    <FormActions :loading="loading" @cancel="$emit('cancel')" />
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import FormActions from '../common/FormActions.vue'

const props = defineProps<{ modelValue?: any; leads?: { label: string; value: number }[] }>()
const emit = defineEmits<{ (e: 'submit', v: any): void; (e: 'cancel'): void }>()

const r = { required: (v: any) => !!v || 'Required' }
const valid = ref(false)
const formRef = ref<any>(null)
const loading = ref(false)
const loadingLeads = ref(false)

const form = reactive({
  lead_id: null,
  reminder_type: 'FOLLOW_UP',
  message: '',
  scheduled_time: ''
})

const types = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Call Note', value: 'CALL' },
  { label: 'Meeting Note', value: 'MEETING' },
  { label: 'Follow-up', value: 'FOLLOW_UP' },
  { label: 'Opportunity', value: 'OPPORTUNITY' }
]

const leads = ref(props.leads || [])

// Auto-fill form if editing
watch(() => props.modelValue, (v) => {
  if (v) Object.assign(form, v)
}, { immediate: true })

// Minimum allowed datetime (current time in local)
const minDateTime = computed(() => {
  const now = new Date()
  now.setSeconds(0, 0) // remove seconds & ms
  return now.toISOString().slice(0, 16) // format for datetime-local
})

// Validation: must be in the future
function validateFutureDate(value: string) {
  if (!value) return true
  const selected = new Date(value)
  const now = new Date()
  return selected > now || 'Scheduled time must be in the future'
}

// Submit handler
function onSubmit() {
  formRef.value.validate().then((success: boolean) => {
    if (!success) return
    emit('submit', {
      lead_id: form.lead_id,
      message: form.message.trim(),
      reminder_type: form.reminder_type,
      scheduled_time: form.scheduled_time
    })
  })
}
</script>
