<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🏘️</span>
        <span class="logo-text">JV Admin</span>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }">
          📊 Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/comunicados" class="nav-item" :class="{ active: route.path.startsWith('/admin/comunicados') }">
          📝 Comunicados
        </NuxtLink>
        <NuxtLink to="/admin/eventos" class="nav-item" :class="{ active: route.path.startsWith('/admin/eventos') }">
          📅 Eventos
        </NuxtLink>
        <NuxtLink to="/admin/servicios" class="nav-item" :class="{ active: route.path.startsWith('/admin/servicios') }">
          🔧 Servicios
        </NuxtLink>
        <NuxtLink to="/admin/solicitudes" class="nav-item" :class="{ active: route.path.startsWith('/admin/solicitudes') }">
          📬 Solicitudes
        </NuxtLink>
        <NuxtLink to="/admin/vecinos" class="nav-item" :class="{ active: route.path.startsWith('/admin/vecinos') }">
          👥 Vecinos
        </NuxtLink>
        <hr class="nav-divider" />
        <NuxtLink to="/" class="nav-item">
          ← Volver al Sitio
        </NuxtLink>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-name">{{ user?.nombre }}</span>
          <span class="user-email">{{ user?.email }}</span>
        </div>
        <button class="btn-logout" @click="logout">Cerrar sesión</button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, fetchUser, logout: authLogout } = useAuth()

onMounted(async () => {
  await fetchUser()
  if (!user.value) {
    router.push('/login')
  } else if (user.value.rol !== 'ADMIN') {
    router.push('/')
  }
})

function logout() {
  authLogout()
  router.push('/')
}
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #08090a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  min-height: 100vh;
  background: #0f1111;
  border-right: 1px solid #1a1d21;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  border-bottom: 1px solid #1a1d21;
}

.logo-icon { font-size: 1.5rem; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: #ffffff; }

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #888;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
}

.nav-item:hover {
  background: #1a1d21;
  color: #ffffff;
}

.nav-item.active {
  background: #1a1d21;
  color: #0075de;
}

.nav-divider {
  border: none;
  border-top: 1px solid #1a1d21;
  margin: 12px 0;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid #1a1d21;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.user-name { font-size: 0.875rem; font-weight: 600; color: #ffffff; }
.user-email { font-size: 0.75rem; color: #888; }

.btn-logout {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid #1a1d21;
  border-radius: 6px;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-logout:hover {
  background: #1a1d21;
  color: #ff4444;
  border-color: #ff4444;
}

/* Main */
.admin-main {
  margin-left: 240px;
  flex: 1;
  padding: 32px;
  min-height: 100vh;
}

/* Utility */
.text-muted { color: #888; }
.text-center { text-align: center; }
.mt-lg { margin-top: 24px; }
</style>
