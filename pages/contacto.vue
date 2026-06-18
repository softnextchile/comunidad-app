<template>
  <div>
    <AppNavbar />
    
    <section class="section" style="background: var(--color-warm-white); padding: 48px 0;">
      <div class="container text-center">
        <h1 class="section-title">Contáctanos</h1>
        <p class="text-muted" style="max-width: 600px; margin: 0 auto;">
          ¿Tienes preguntas o quieres colaborar? Escríbenos.
        </p>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div style="max-width: 600px; margin: 0 auto;">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input 
                v-model="form.nombre" 
                type="text" 
                class="form-input" 
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input" 
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Teléfono (opcional)</label>
              <input 
                v-model="form.telefono" 
                type="tel" 
                class="form-input" 
                placeholder="+56 9 1234 5678"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Mensaje *</label>
              <textarea 
                v-model="form.mensaje" 
                class="form-input" 
                placeholder="¿En qué podemos ayudarte?"
                rows="5"
                required
              ></textarea>
            </div>
            
            <div v-if="success" class="mb-md" style="padding: 16px; background: #e6f7ed; color: #1aae39; border-radius: 8px;">
              ✓ ¡Mensaje enviado con éxito! Te responderemos pronto.
            </div>
            
            <div v-if="error" class="mb-md" style="padding: 16px; background: #fee; color: #dc3545; border-radius: 8px;">
              {{ error }}
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary btn-lg" 
              style="width: 100%;"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </form>
          
          <div class="mt-lg text-center text-muted">
            <p><strong>📍 Ubicación:</strong> Santiago, Chile</p>
            <p><strong>📧 Email:</strong> contacto@softnext.cl</p>
          </div>
        </div>
      </div>
    </section>
    
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

const isLoading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  success.value = false
  
  try {
    await $fetch('/api/contactos/submit', {
      method: 'POST',
      body: form
    })
    
    success.value = true
    form.nombre = ''
    form.email = ''
    form.telefono = ''
    form.mensaje = ''
  } catch (e: any) {
    error.value = e.data?.message || 'Error al enviar el mensaje'
  } finally {
    isLoading.value = false
  }
}
</script>
