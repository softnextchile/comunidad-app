<template>
  <div>
    <AppNavbar />
    
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 style="margin-bottom: 24px; font-size: 1.25rem;">Panel Admin</h2>
        <nav>
          <NuxtLink to="/admin" class="admin-nav-item">
            📊 Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/secciones" class="admin-nav-item">
            📝 Secciones
          </NuxtLink>
          <NuxtLink to="/admin/noticias" class="admin-nav-item">
            📰 Noticias
          </NuxtLink>
          <NuxtLink to="/admin/contactos" class="admin-nav-item" :class="{ active: route.path === '/admin/contactos' }">
            ✉️ Contactos
          </NuxtLink>
        </nav>
      </aside>
      
      <main class="admin-content">
        <h1 style="margin-bottom: 24px;">Mensajes de Contacto</h1>
        
        <div v-if="loading" class="text-center text-muted">
          Cargando...
        </div>
        
        <div v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contacto in contactos" :key="contacto.id">
                <td>{{ contacto.nombre }}</td>
                <td>{{ contacto.email }}</td>
                <td style="max-width: 300px;">
                  {{ contacto.mensaje.substring(0, 100) }}{{ contacto.mensaje.length > 100 ? '...' : '' }}
                </td>
                <td>{{ formatDate(contacto.createdAt) }}</td>
                <td>
                  <span :class="['badge', contacto.leido ? 'badge-success' : 'badge-warning']">
                    {{ contacto.leido ? 'Leído' : 'Nuevo' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="contactos.length === 0" class="text-center text-muted" style="padding: 48px;">
            No hay mensajes de contacto.
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAdmin, isAuthenticated, fetchUser } = useAuth()

onMounted(async () => {
  await fetchUser()
  if (!isAuthenticated.value) {
    router.push('/login')
  } else if (!isAdmin.value) {
    router.push('/')
  }
  loadContactos()
})

const contactos = ref<any[]>([])
const loading = ref(true)

const loadContactos = async () => {
  try {
    contactos.value = await $fetch<any[]>('/api/contactos')
  } catch (e) {
    console.error('Error loading:', e)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
