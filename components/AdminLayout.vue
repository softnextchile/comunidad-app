<template>
  <div class="admin-shell">
    <!-- Mobile header -->
    <header class="mobile-header">
      <button class="hamburger" @click="sidebarOpen = !sidebarOpen" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
      <span class="mobile-logo">JV Admin</span>
    </header>

    <!-- Overlay backdrop (mobile) -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-logo">
        <span class="logo-icon">🏘️</span>
        <span class="logo-text">JV Admin</span>
        <button class="sidebar-close" @click="sidebarOpen = false" aria-label="Cerrar menú">✕</button>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }" @click="sidebarOpen = false">
          📊 Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/comunicados" class="nav-item" :class="{ active: route.path.startsWith('/admin/comunicados') }" @click="sidebarOpen = false">
          📝 Comunicados
        </NuxtLink>
        <NuxtLink to="/admin/eventos" class="nav-item" :class="{ active: route.path.startsWith('/admin/eventos') }" @click="sidebarOpen = false">
          📅 Eventos
        </NuxtLink>
        <NuxtLink to="/admin/servicios" class="nav-item" :class="{ active: route.path.startsWith('/admin/servicios') }" @click="sidebarOpen = false">
          🔧 Servicios
        </NuxtLink>
        <NuxtLink to="/admin/solicitudes" class="nav-item" :class="{ active: route.path.startsWith('/admin/solicitudes') }" @click="sidebarOpen = false">
          📬 Solicitudes
        </NuxtLink>
        <NuxtLink to="/admin/vecinos" class="nav-item" :class="{ active: route.path.startsWith('/admin/vecinos') }" @click="sidebarOpen = false">
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
const sidebarOpen = ref(false)

onMounted(async () => {
  await fetchUser()
  if (!user.value) {
    router.push('/login')
  } else if (user.value.rol !== 'ADMIN') {
    router.push('/')
  }
})

function logout() {
  sidebarOpen.value = false
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

/* ── Mobile header ── */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0f1111;
  border-bottom: 1px solid #1a1d21;
  align-items: center;
  padding: 0 16px;
  gap: 14px;
  z-index: 50;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #888;
  border-radius: 2px;
  transition: background 0.15s;
}

.hamburger:hover span { background: #fff; }

.mobile-logo {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

/* ── Overlay ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
}

/* ── Sidebar ── */
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
  z-index: 100;
  transition: transform 0.25s ease;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid #1a1d21;
}

.logo-icon { font-size: 1.4rem; }
.logo-text { font-size: 1.05rem; font-weight: 700; color: #ffffff; flex: 1; }

.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  white-space: nowrap;
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
  margin: 10px 0;
}

.sidebar-footer {
  padding: 14px 10px;
  border-top: 1px solid #1a1d21;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.user-name { font-size: 0.875rem; font-weight: 600; color: #fff; }
.user-email { font-size: 0.72rem; color: #888; overflow: hidden; text-overflow: ellipsis; }

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

/* ── Main ── */
.admin-main {
  margin-left: 240px;
  flex: 1;
  padding: 32px;
  min-height: 100vh;
}

/* ── Responsive: < 768px ── */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: block;
  }

  .admin-main {
    margin-left: 0;
    padding: 20px 16px;
    padding-top: 72px; /* below mobile header */
  }
}
</style>
