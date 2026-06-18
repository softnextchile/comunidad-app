<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <NuxtLink to="/" class="auth-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0075de" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Villa Arrayán
        </NuxtLink>
        <h1 class="auth-title">Crear cuenta</h1>
        <p class="auth-subtitle">Registrate como vecino de Villa Arrayán</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <label class="form-label">Nombre completo</label>
          <input
            v-model="form.nombre"
            type="text"
            class="form-input"
            placeholder="Tu nombre"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="tu@email.cl"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Numero de casa / lote (opcional)</label>
          <input
            v-model="form.numeroCasa"
            type="text"
            class="form-input"
            placeholder="Casa 12 / Lote 5"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Contrasena</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="Minimo 6 caracteres"
            required
            minlength="6"
          />
        </div>

        <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>

        <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Crear cuenta' }}
        </button>
      </form>

      <div class="auth-footer">
        Ya tienes cuenta? <NuxtLink to="/login">Inicia sesion</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const form = reactive({
  nombre: '',
  email: '',
  numeroCasa: '',
  password: '',
})
const loading = ref(false)
const errorMsg = ref('')

async function register() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: form,
    })
    await navigateTo('/registro/exito')
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-warm-white);
  padding: 24px;
}

.auth-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  margin-bottom: 20px;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.auth-subtitle {
  color: #888;
  font-size: 0.875rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-error {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.auth-form .btn {
  width: 100%;
  margin-top: 8px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.875rem;
  color: #888;
}

.auth-footer a {
  color: #0075de;
  font-weight: 600;
}
</style>
