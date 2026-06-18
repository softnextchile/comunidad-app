<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <div v-if="loading" class="confirm-loading">
        <div class="spinner"></div>
        <p>Confirmando tu email...</p>
      </div>
      <div v-else-if="success" class="confirm-success">
        <div class="confirm-icon success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2>Email confirmado</h2>
        <p>{{ message }}</p>
        <NuxtLink to="/login" class="btn btn-primary btn-lg">
          Ir a iniciar sesion
        </NuxtLink>
      </div>
      <div v-else class="confirm-error">
        <div class="confirm-icon error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2>Error</h2>
        <p>{{ message }}</p>
        <NuxtLink to="/registro" class="btn btn-secondary">
          Volver al registro
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string
const loading = ref(true)
const success = ref(false)
const message = ref('')

const { data, error } = await useFetch(`/api/auth/confirmar/${token}`)

loading.value = false

if (error.value) {
  success.value = false
  message.value = error.value.data?.message || 'Token invalido o expirado'
} else {
  success.value = true
  message.value = 'Tu cuenta ha sido activada. Te enviamos un correo de bienvenida.'
}
</script>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-warm-white);
  padding: 24px;
}

.confirm-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.confirm-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e8e8e8;
  border-top-color: #0075de;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.confirm-success h2,
.confirm-error h2 {
  margin: 16px 0 8px;
  color: #1a1a1a;
}

.confirm-success p,
.confirm-error p {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.confirm-icon.success {
  background: #dcfce7;
  color: #16a34a;
}

.confirm-icon.error {
  background: #fee2e2;
  color: #dc2626;
}
</style>
