<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2>Registro exitoso</h2>
      <p>Te enviamos un email de confirmacion a <strong>{{ registeredEmail }}</strong>.</p>
      <p class="success-hint">Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.</p>
      <NuxtLink to="/login" class="btn btn-primary btn-lg">
        Ir a iniciar sesion
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-warm-white);
  padding: 24px;
}

.success-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 440px;
  width: 100%;
  text-align: center;
}

.success-icon {
  width: 72px;
  height: 72px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-card h2 {
  color: #1a1a1a;
  margin-bottom: 12px;
}

.success-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.success-hint {
  font-size: 0.875rem;
  color: #888 !important;
  margin-bottom: 24px !important;
}
</style>
