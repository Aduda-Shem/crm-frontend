<template>
  <v-form @submit.prevent="onSubmit" v-model="valid">
    <v-text-field
      v-model="form.name"
      label="Name"
      variant="outlined"
      density="comfortable"
      :rules="[r.required]"
    />
    <v-select
      v-model="form.status"
      :items="statuses"
      label="Status"
      variant="outlined"
      density="comfortable"
    />
    <v-textarea
      v-model="form.description"
      label="Description"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model.number="form.value"
      label="Value"
      type="number"
      variant="outlined"
      density="comfortable"
    />
    <v-text-field
      v-model="form.source"
      label="Source"
      variant="outlined"
      density="comfortable"
    />
    <FormActions :loading="loading" @cancel="$emit('cancel')" />
  </v-form>
</template>
<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import FormActions from "@/components/common/FormActions.vue";

const props = defineProps<{ modelValue?: any }>();
const emits = defineEmits<{
  (e: "submit", value: any): void;
  (e: "cancel"): void;
}>();
const r = { required: (v: any) => !!v || "Required" };
const statuses = ["NEW", "IN_PROGRESS", "WON", "LOST"];
const valid = ref(false);
const loading = ref(false);
const form = reactive<any>({
  name: "",
  status: "NEW",
  description: "",
  value: null,
  source: "",
});
watch(
  () => props.modelValue,
  (v) => {
    Object.assign(form, v || {});
  },
  { immediate: true }
);
function onSubmit() {
  emits("submit", { ...form });
}
</script>


