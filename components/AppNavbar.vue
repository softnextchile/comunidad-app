<template>
  <nav class="navbar">
    <div class="container navbar-inner">
      <a href="/" class="navbar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0075de" stroke-width="2" style="margin-right:8px">
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
          <NuxtLink v-if="isAdmin" to="/admin" class="btn btn-secondary">
            Panel Admin
          </NuxtLink>
          <NuxtLink to="/mis-solicitudes" class="btn btn-ghost">
            Mis Solicitudes
          </NuxtLink>
          <button @click="logout" class="btn btn-ghost">
            Cerrar Sesión
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn btn-ghost">
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/registro" class="btn btn-primary">
            Registrarse
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, isAdmin, logout } = useAuth()
</script>
