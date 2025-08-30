<template>
  <div>
    <h1>Notes</h1>
    <div class="card" v-for="n in notes" :key="n.id">
      {{ n.content }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/client'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const notes = ref<any[]>([])

async function load() {
  const { data } = await api.get('/api/notes/', { headers: auth.authHeader })
  notes.value = data.results
}

onMounted(load)
</script>
