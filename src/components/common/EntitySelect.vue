<template>
  <v-select
    :label="label"
    :items="items"
    :item-title="titleField"
    :item-value="valueField"
    v-model="innerValue"
    variant="outlined"
    density="comfortable"
    :loading="loading"
    :disabled="disabled"
    :clearable="clearable"
    @update:modelValue="emitValue"
  />
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '../../services/api'

const props = defineProps<{
  label: string
  api: string
  titleField?: string
  valueField?: string
  modelValue?: any
  params?: Record<string, any>
  disabled?: boolean
  clearable?: boolean
}>()
const emit = defineEmits<{ (e:'update:modelValue', v:any): void }>()

const items = ref<any[]>([])
const loading = ref(false)
const innerValue = ref<any>(props.modelValue ?? null)
const titleField = props.titleField ?? 'name'
const valueField = props.valueField ?? 'id'

function emitValue(v:any){ emit('update:modelValue', v) }

async function load(){
  loading.value = true
  try {
    const { data } = await api.get(props.api, { params: { rows: 100, ...(props.params||{}) } })
    items.value = data?.results || data || []
  } finally { loading.value = false }
}

watch(()=>props.params, load, { deep: true })
watch(()=>props.modelValue, (v)=>{ innerValue.value = v }, { immediate: true })
onMounted(load)
</script>


