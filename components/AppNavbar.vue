<template>
  <nav class="navbar">
    <div class="container navbar-inner">
      <NuxtLink to="/" class="navbar-brand">
        {{ config.public.siteName }}
      </NuxtLink>
      
      <div class="navbar-links">
        <NuxtLink to="/" class="navbar-link" :class="{ active: route.path === '/' }">
          Inicio
        </NuxtLink>
        <NuxtLink to="/noticias" class="navbar-link" :class="{ active: route.path === '/noticias' }">
          Noticias
        </NuxtLink>
        <NuxtLink to="/quienes-somos" class="navbar-link" :class="{ active: route.path === '/quienes-somos' }">
          Quiénes Somos
        </NuxtLink>
        <NuxtLink to="/contacto" class="navbar-link" :class="{ active: route.path === '/contacto' }">
          Contacto
        </NuxtLink>
      </div>
      
      <div class="navbar-actions">
        <template v-if="isAuthenticated">
          <NuxtLink v-if="isAdmin" to="/admin" class="btn btn-secondary">
            Panel Admin
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
const route = useRoute()
const config = useRuntimeConfig()
const { isAuthenticated, isAdmin, logout, fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>
