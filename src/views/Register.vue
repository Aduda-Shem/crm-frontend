<template>
  <v-container
    class="d-flex align-center justify-center"
    style="
      min-height: 100vh;
      background: linear-gradient(180deg, #f8fbff, #eef3f9);
    "
  >
    <v-card max-width="520" class="pa-8" elevation="3">
      <div class="d-flex align-center mb-4">
        <v-avatar color="primary" size="36" class="mr-3">
          <v-icon color="white">mdi-account-plus</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6">Create your account</div>
          <div class="text-caption text-medium-emphasis">
            Join the workspace
          </div>
        </div>
      </div>
      <v-card-text class="pa-0">
        <v-form @submit.prevent="submit" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="username"
                label="Username"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Required']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                label="Email"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => /.+@.+\..+/.test(v) || 'Invalid email']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => (v?.length || 0) >= 6 || 'Min 6 chars']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="role"
                :items="roles"
                label="Role"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
          <v-btn
            type="submit"
            color="primary"
            class="mt-2"
            :disabled="!valid"
            block
            size="large"
            :loading="loading"
            >Create account</v-btn
          >
          <v-btn variant="text" class="mt-2" block to="/login"
            >I already have an account</v-btn
          >
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            density="comfortable"
            >{{ error }}</v-alert
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import { register as apiRegister } from "../services/api";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const role = ref<"MANAGER" | "AGENT">("AGENT");
const roles = ["MANAGER", "AGENT"];
const error = ref("");
const valid = ref(false);
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    const data = await apiRegister({
      username: username.value,
      password: password.value,
      email: email.value,
      role: role.value,
    });
    if ((data as any)?.tokens) {
      auth.accessToken = (data as any).tokens.access;
      auth.refreshToken = (data as any).tokens.refresh;
      auth.role = (data as any).user?.role || role.value;
      auth.persist();
      router.push("/");
    } else {
      router.push("/login");
    }
  } catch (e: any) {
    error.value = e?.response?.data?.detail || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>
