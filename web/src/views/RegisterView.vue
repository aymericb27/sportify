<template>
  <div class="auth-page">
    <div class="auth-bg" />

    <main class="auth-wrap">
      <section class="auth-card">
        <header class="auth-header">
          <div class="brand">
            <div class="brand-icon">🏆</div>
            <div>
              <h1 class="title">Créer un compte</h1>
              <p class="subtitle">Commence ta progression.</p>
            </div>
          </div>
        </header>

        <form class="form" @submit.prevent="submit">
          <div class="field">
            <label class="label">Pseudo</label>
            <input v-model="name" class="input" type="text" placeholder="ex: Athlète" />
          </div>

          <div class="field">
            <label class="label">Email</label>
            <input v-model="email" class="input" type="email" placeholder="ex: athlete@mail.com" />
          </div>

          <div class="field">
            <label class="label">Mot de passe</label>
            <input v-model="password" class="input" type="password" placeholder="••••••••" />
          </div>

          <div class="field">
            <label class="label">Confirmation</label>
            <input
              v-model="passwordConfirmation"
              class="input"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <button class="btn btn-primary" :disabled="loading">
            <span class="btn-icon">＋</span>
            {{ loading ? "Création..." : "Créer mon compte" }}
          </button>

          <RouterLink class="btn btn-ghost" to="/login">
            <span class="btn-icon">↩</span>
            J’ai déjà un compte
          </RouterLink>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../auth/authStore";

const router = useRouter();
const auth = useAuthStore();

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const passwordConfirmation = ref<string>("");

const loading = ref(false);
const error = ref<string | null>(null);

const submit = async (): Promise<void> => {
  error.value = null;

  if (password.value !== passwordConfirmation.value) {
    error.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  loading.value = true;
  try {
    // nécessite auth.register() (voir plus bas)
    await auth.register(name.value, email.value, password.value, passwordConfirmation.value);
    router.push("/");
  } catch (e: any) {
    // Laravel renvoie souvent { message, errors: {field:[...]}}
    const first =
      e?.response?.data?.message ??
      e?.response?.data?.errors?.email?.[0] ??
      e?.response?.data?.errors?.password?.[0];

    error.value = first ?? "Impossible de créer le compte.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* même CSS que LoginView pour un style cohérent */
.auth-page {
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #faf7ff;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.18), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.14), transparent 55%),
    radial-gradient(circle at 50% 90%, rgba(236, 72, 153, 0.08), transparent 55%);
  filter: blur(6px);
}

.auth-wrap {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(124, 58, 237, 0.12);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(17, 24, 39, 0.08);
  backdrop-filter: blur(10px);
  padding: 26px;
}

.auth-header {
  margin-bottom: 18px;
}

.brand {
  display: flex;
  gap: 14px;
  align-items: center;
}

.brand-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(168, 85, 247, 0.18));
  border: 1px solid rgba(124, 58, 237, 0.18);
}

.title {
  font-size: 24px;
  line-height: 1.15;
  margin: 0;
  color: #1f2937;
}

.subtitle {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #4b5563;
}

.input {
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(124, 58, 237, 0.18);
  background: rgba(255, 255, 255, 0.9);
  padding: 0 14px;
  outline: none;
  color: #111827;
  transition: 0.15s ease;
}

.input:focus {
  border-color: rgba(124, 58, 237, 0.45);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
}

.error {
  margin: 2px 0 0;
  color: #b91c1c;
  font-size: 13px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.18);
  border-radius: 14px;
  padding: 10px 12px;
}

.btn {
  height: 46px;
  border-radius: 999px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  transition: transform 0.08s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.22);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-ghost {
  color: #6d28d9;
  background: rgba(124, 58, 237, 0.08);
  border-color: rgba(124, 58, 237, 0.16);
}

.btn-icon {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.btn-ghost .btn-icon {
  background: rgba(124, 58, 237, 0.12);
}
</style>
