<template>
  <section class="hero">
    <div class="hero-image-overlay">
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80"
        alt="Comunidad tecnológica"
        class="hero-image"
      />
      <div class="hero-gradient"></div>
    </div>
    <div class="container hero-content">
      <div class="hero-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Comunidad líder en innovación
      </div>
      <h1 class="hero-title">{{ hero?.titulo || 'Bienvenido a Nuestra Comunidad' }}</h1>
      <p class="hero-subtitle">
        {{ hero?.subtitulo || 'Un espacio para conectar, aprender y crecer juntos en el mundo de la tecnología.' }}
      </p>
      <div class="hero-actions">
        <NuxtLink to="/registro" class="btn btn-primary btn-lg">
          Únete Ahora
        </NuxtLink>
        <NuxtLink to="/noticias" class="btn btn-outline-light btn-lg">
          Ver Noticias
        </NuxtLink>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-number">500+</span>
          <span class="hero-stat-label">Miembros</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-number">25+</span>
          <span class="hero-stat-label">Eventos</span>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <span class="hero-stat-number">10+</span>
          <span class="hero-stat-label">Charlas</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: seccionesData } = await useFetch('/api/secciones')
const hero = computed(() => seccionesData.value?.find((s: any) => s.clave === 'hero'))
</script>
