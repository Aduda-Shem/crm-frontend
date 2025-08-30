<template>
  <v-navigation-drawer v-model="model" location="right" temporary width="480">
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-close" variant="text" @click="close" />
    </v-toolbar>
    <div class="pa-4">
      <slot />
    </div>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; title?: string }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean): void }>()
const model = ref(props.modelValue)
watch(()=>props.modelValue, v=>model.value=v)
function close(){ emit('update:modelValue', false) }
</script>


