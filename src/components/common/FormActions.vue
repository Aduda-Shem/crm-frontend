<template>
  <div class="d-flex justify-end mt-2">
    <v-btn variant="text" class="mr-2" @click="$emit('cancel')">Cancel</v-btn>
    <v-btn color="primary" type="submit" :loading="loading">Save</v-btn>
  </div>
</template>
<script setup lang="ts">
defineProps<{ loading?: boolean }>()
</script>


