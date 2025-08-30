<template>
  <v-app>
    <template v-if="!isAuthRoute">
      <AppShell>
        <v-container class="py-6" fluid>
          <router-view />
        </v-container>
      </AppShell>
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
const route = useRoute()
const isAuthRoute = computed(() => ['/login','/register'].includes(route.path))
</script>
