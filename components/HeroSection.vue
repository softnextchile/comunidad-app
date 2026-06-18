<template>
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">{{ hero?.titulo || 'Bienvenido a Nuestra Comunidad' }}</h1>
      <p class="hero-subtitle">
        {{ hero?.subtitulo || 'Un espacio para conectar, aprender y crecer juntos en el mundo de la tecnología.' }}
      </p>
      <div class="hero-actions">
        <NuxtLink to="/registro" class="btn btn-primary btn-lg">
          Únete Ahora
        </NuxtLink>
        <NuxtLink to="/noticias" class="btn btn-secondary btn-lg">
          Ver Noticias
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: seccionesData } = await useFetch('/api/secciones')
const hero = computed(() => seccionesData.value?.find((s: any) => s.clave === 'hero'))
</script>
