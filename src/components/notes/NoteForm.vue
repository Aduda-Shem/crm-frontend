<template>
  <v-form @submit.prevent="onSubmit" v-model="valid">
    <v-select
      v-model="form.note_type"
      :items="types"
      label="Type"
      variant="outlined"
      density="comfortable"
    />
    <v-textarea
      v-model="form.content"
      label="Note"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
      rows="5"
      auto-grow
    />
  </v-form>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
const props = defineProps<{ modelValue?: any }>();
const emit = defineEmits<{ (e: "submit", v: any): void }>();
const r = { required: (v: any) => !!v || "Required" };
const valid = ref(false);
const types = ["GENERAL", "CALL", "MEETING", "FOLLOW_UP", "OPPORTUNITY"];
const form = reactive<any>({ content: "", note_type: "GENERAL" });
watch(
  () => props.modelValue,
  (v) => {
    Object.assign(form, v || {});
  },
  { immediate: true }
);
function onSubmit() {
  emit("submit", { ...form });
}
</script>


