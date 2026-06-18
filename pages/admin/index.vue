<template>
  <div>
    <AppNavbar />
    
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 style="margin-bottom: 24px; font-size: 1.25rem;">Panel Admin</h2>
        <nav>
          <NuxtLink to="/admin" class="admin-nav-item" :class="{ active: route.path === '/admin' }">
            📊 Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/secciones" class="admin-nav-item">
            📝 Secciones
          </NuxtLink>
          <NuxtLink to="/admin/noticias" class="admin-nav-item">
            📰 Noticias
          </NuxtLink>
          <NuxtLink to="/admin/contactos" class="admin-nav-item">
            ✉️ Contactos
          </NuxtLink>
          <NuxtLink to="/" class="admin-nav-item">
            ← Volver al Sitio
          </NuxtLink>
        </nav>
      </aside>
      
      <main class="admin-content">
        <h1 style="margin-bottom: 24px;">Dashboard</h1>
        
        <div class="section-grid">
          <div class="card">
            <h3>Noticias</h3>
            <p style="font-size: 2rem; font-weight: 700; color: var(--color-accent);">
              {{ stats.noticias }}
            </p>
            <NuxtLink to="/admin/noticias" class="text-small">Ver todas →</NuxtLink>
          </div>
          
          <div class="card">
            <h3>Contactos</h3>
            <p style="font-size: 2rem; font-weight: 700; color: var(--color-accent);">
              {{ stats.contactos }}
            </p>
            <NuxtLink to="/admin/contactos" class="text-small">Ver todos →</NuxtLink>
          </div>
          
          <div class="card">
            <h3>Usuarios</h3>
            <p style="font-size: 2rem; font-weight: 700; color: var(--color-accent);">
              {{ stats.usuarios }}
            </p>
          </div>
        </div>
        
        <div class="card mt-lg">
          <h3 style="margin-bottom: 16px;">Acciones Rápidas</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <NuxtLink to="/admin/noticias" class="btn btn-primary">
              + Nueva Noticia
            </NuxtLink>
            <NuxtLink to="/admin/secciones" class="btn btn-secondary">
              Editar Secciones
            </NuxtLink>
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
})

const stats = reactive({
  noticias: 0,
  contactos: 0,
  usuarios: 0
})

onMounted(async () => {
  try {
    const [noticias, contactos] = await Promise.all([
      $fetch<any>('/api/noticias?published=false&limit=100'),
      $fetch<any>('/api/contactos')
    ])
    stats.noticias = noticias.pagination?.total || 0
    stats.contactos = contactos.length || 0
  } catch (e) {
    console.error('Error loading stats:', e)
  }
})
</script>
