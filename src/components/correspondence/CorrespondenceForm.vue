<template>
  <v-form @submit.prevent="onSubmit" v-model="valid">
    <!-- Contact select -->
    <v-select
      v-model="form.contact"
      :items="contacts"
      item-title="label"
      item-value="value"
      label="Contact"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
      placeholder="Select a contact"
      clearable
    />

    <!-- Type select -->
    <v-select
      v-model="form.type"
      :items="types"
      item-title="label"
      item-value="value"
      label="Type"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
      clearable
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
import { reactive, ref, watch } from 'vue'
import FormActions from '../common/FormActions.vue'

/**
 * Props & Emits
 */
const props = defineProps<{
  modelValue?: any
  contacts: { label: string; value: number }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'submit', v: any): void
  (e: 'cancel'): void
}>()

/**
 * Validation
 */
const r = { required: (v: any) => !!v || 'Required' }
const valid = ref(false)
const loading = ref(false)

/**
 * Form State
 */
const form = reactive<any>({
  contact: null,
  type: 'call',
  notes: '',
  outcome: '',
  duration: null,
})

/**
 * Type options
 */
const types = [
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'call' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Text', value: 'text' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Other', value: 'other' },
]

/**
 * Sync parent → local form
 */
watch(
  () => props.modelValue,
  (v) => {
    if (v) Object.assign(form, v)
  },
  { immediate: true }
)

/**
 * Sync local form → parent
 */
watch(
  form,
  (v) => {
    emit('update:modelValue', { ...v })
  },
  { deep: true }
)

/**
 * Submit form
 */
function onSubmit() {
  emit('submit', { ...form })
}
</script>
