<template>
  <v-dialog v-model="model" max-width="420">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; title: string; text: string }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean): void; (e:'confirm'): void }>()
const model = ref(props.modelValue)
watch(()=>props.modelValue, v=>model.value=v)
function cancel(){ emit('update:modelValue', false) }
function confirm(){ emit('confirm'); emit('update:modelValue', false) }
</script>


