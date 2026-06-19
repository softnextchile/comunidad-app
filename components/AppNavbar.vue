<template>
  <nav class="navbar">
    <div class="container navbar-inner">
      <a href="/" class="navbar-brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0075de" stroke-width="2" style="margin-right:7px">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Villa Arrayán
      </a>

      <div class="navbar-links">
        <a href="#comunicados" class="navbar-link">Comunicados</a>
        <a href="#eventos" class="navbar-link">Eventos</a>
        <a href="#servicios" class="navbar-link">Servicios</a>
        <a href="#contacto" class="navbar-link">Contacto</a>
      </div>

      <div class="navbar-actions">
        <template v-if="isAuthenticated">
          <NuxtLink v-if="isAdmin" to="/admin" class="btn btn-secondary hide-mobile">
            Panel Admin
          </NuxtLink>
          <NuxtLink to="/mis-solicitudes" class="btn btn-ghost hide-mobile">
            Mis Solicitudes
          </NuxtLink>
          <button @click="logout" class="btn btn-ghost hide-mobile">
            Cerrar Sesión
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn btn-ghost hide-mobile">
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/registro" class="btn btn-primary hide-mobile">
            Registrarse
          </NuxtLink>
        </template>
      </div>

      <!-- Hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="mobile-menu">
      <a href="#comunicados" class="mobile-link" @click="menuOpen = false">Comunicados</a>
      <a href="#eventos" class="mobile-link" @click="menuOpen = false">Eventos</a>
      <a href="#servicios" class="mobile-link" @click="menuOpen = false">Servicios</a>
      <a href="#contacto" class="mobile-link" @click="menuOpen = false">Contacto</a>
      <hr class="mobile-divider" />
      <template v-if="isAuthenticated">
        <NuxtLink v-if="isAdmin" to="/admin" class="mobile-link mobile-link-btn" @click="menuOpen = false">Panel Admin</NuxtLink>
        <NuxtLink to="/mis-solicitudes" class="mobile-link mobile-link-btn" @click="menuOpen = false">Mis Solicitudes</NuxtLink>
        <button @click="logout(); menuOpen = false" class="mobile-link mobile-link-btn">Cerrar Sesión</button>
      </template>
      <template v-else>
        <NuxtLink to="/login" class="mobile-link mobile-link-btn" @click="menuOpen = false">Iniciar Sesión</NuxtLink>
        <NuxtLink to="/registro" class="mobile-link mobile-link-btn mobile-link-primary" @click="menuOpen = false">Registrarse</NuxtLink>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, isAdmin, logout } = useAuth()
const menuOpen = ref(false)
</script>
