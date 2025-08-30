<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" :rail="rail" app color="surface">
      <v-list dense>
        <v-list-item class="px-4 py-4">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="28" class="mr-2">
              <v-icon color="white">mdi-briefcase</v-icon>
            </v-avatar>
            <span class="text-subtitle-1 font-weight-medium">Lead Manager</span>
          </div>
        </v-list-item>

        <v-divider />

        <v-list-item
          to="/"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
        />
        <v-list-item to="/leads" prepend-icon="mdi-account-tie" title="Leads" />
        <v-list-item
          to="/contacts"
          prepend-icon="mdi-account-box"
          title="Contacts"
        />
        <v-list-item
          to="/reminders"
          prepend-icon="mdi-bell"
          title="Reminders"
        />
        <v-list-item
          to="/correspondence"
          prepend-icon="mdi-email"
          title="Correspondence"
        />
        <v-list-item
          v-if="role === 'MANAGER'"
          to="/audit"
          prepend-icon="mdi-history"
          title="Audit Trail"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="0" color="surface">
      <v-btn icon variant="text" @click="rail = !rail">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <v-spacer />

      <v-chip color="primary" class="mr-2" variant="flat">{{
        role || "GUEST"
      }}</v-chip>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="32">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item title="Profile" prepend-icon="mdi-account-circle" />
          <v-list-item
            title="Logout"
            prepend-icon="mdi-logout"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <slot />
    </v-main>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirm.show" max-width="420">
      <v-card>
        <v-card-title>{{ confirm.title }}</v-card-title>
        <v-card-text>{{ confirm.text }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="answer(false)">Cancel</v-btn>
          <v-btn color="primary" @click="answer(true)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../store/auth";
import { useUiStore } from "../../store/ui";
import { useRoute } from "vue-router";

const drawer = ref(true);
const rail = ref(false);

const auth = useAuthStore();
const { role } = storeToRefs(auth);
const logout = () => auth.logout();

const ui = useUiStore();
const { snackbar, confirm } = storeToRefs(ui);
const answer = (v: boolean) => ui.confirmAnswer(v);

const route = useRoute();
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/leads": "Leads",
    "/contacts": "Contacts",
    "/reminders": "Reminders",
    "/correspondence": "Correspondence",
    "/audit": "Audit Trail",
  };
  return titles[route.path] || "Lead Management";
});

const q = ref("");
</script>

<style scoped>
.v-navigation-drawer {
  width: 260px;
}

.v-list-item {
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
