<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input 
            v-model="nombre" 
            type="text" 
            class="form-input" 
            placeholder="Tu nombre"
            required
          />
        </div>
        
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
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
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
          {{ isLoading ? 'Creando...' : 'Crear Cuenta' }}
        </button>
      </form>
      
      <p class="text-center mt-lg text-muted text-small">
        ¿Ya tienes cuenta? 
        <NuxtLink to="/login">Inicia Sesión</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register, isLoading } = useAuth()
const router = useRouter()

const nombre = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  const result = await register(email.value, password.value, nombre.value)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Error al registrarse'
  }
}
</script>
