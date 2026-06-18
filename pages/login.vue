<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Iniciar Sesión</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-input" 
            placeholder="tu@email.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input" 
            placeholder="••••••••"
            required
          />
        </div>
        
        <div v-if="error" class="mb-md" style="color: #dc3545; font-size: 0.875rem;">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary btn-lg" 
          style="width: 100%;"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
      </form>
      
      <p class="text-center mt-lg text-muted text-small">
        ¿No tienes cuenta? 
        <NuxtLink to="/registro">Regístrate</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, isLoading } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  const result = await login(email.value, password.value)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Error al iniciar sesión'
  }
}
</script>
