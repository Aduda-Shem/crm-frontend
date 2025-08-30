<template>
  <v-container
    class="d-flex align-center justify-center"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #f8fbff, #eef3f9);
    "
  >
    <v-card max-width="480" class="pa-8" elevation="3">
      <div class="d-flex align-center mb-4">
        <v-avatar color="primary" size="36" class="mr-3">
          <v-icon color="white">mdi-briefcase</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6">Lead Manager</div>
          <div class="text-caption text-medium-emphasis">Welcome back</div>
        </div>
      </div>
      <v-card-text class="pa-0">
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="username"
            label="Username"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :disabled="loading"
            autocomplete="username"
          />
          <v-text-field
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            label="Password"
            variant="outlined"
            density="comfortable"
            class="mb-1"
            :disabled="loading"
            autocomplete="current-password"
            :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPass = !showPass"
          />
          <div class="d-flex align-center justify-space-between mb-1">
            <v-checkbox
              v-model="remember"
              label="Remember me"
              density="comfortable"
              hide-details
            />
            <v-btn variant="text" size="small">Forgot password?</v-btn>
          </div>
          <v-btn
            type="submit"
            color="primary"
            class="mt-2"
            block
            size="large"
            :loading="loading"
            >Sign in</v-btn
          >
          <v-btn variant="text" class="mt-2" block to="/register"
            >Create account</v-btn
          >
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            density="comfortable"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPass = ref(false);
const remember = ref(true);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    if (!remember.value) {
      // If not remembering, avoid persisting to localStorage
      localStorage.removeItem("auth");
    }
    router.push("/");
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Invalid credentials";
  } finally {
    loading.value = false;
  }
}
</script>
