<template>
  <v-dialog v-model="model" max-width="720">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" v-if="icon">{{ icon }}</v-icon>
        <span>{{ title }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-4">
        <slot />
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" :loading="loading" @click="$emit('save')">{{ primaryText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ modelValue: boolean; title: string; primaryText?: string; loading?: boolean; icon?: string }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean): void; (e:'save'): void }>()
const model = ref(props.modelValue)
watch(()=>props.modelValue, v=>model.value=v)
function close(){ emit('update:modelValue', false) }
</script>


