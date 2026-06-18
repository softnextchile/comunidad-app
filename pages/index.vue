<template>
  <div>
    <AppNavbar />
    
    <HeroSection />
    
    <!-- Noticias Recientes -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Últimas Noticias</h2>
        <div class="section-grid">
          <article v-for="noticia in noticias" :key="noticia.id" class="card news-card">
            <img 
              v-if="noticia.imagenUrl" 
              :src="noticia.imagenUrl" 
              :alt="noticia.titulo"
              class="news-card-image"
            />
            <div v-else class="news-card-image" style="background: var(--color-warm-white);"></div>
            <div class="news-card-content">
              <h3 class="news-card-title">{{ noticia.titulo }}</h3>
              <p class="news-card-excerpt">{{ noticia.resumen }}</p>
              <span class="news-card-date">{{ formatDate(noticia.createdAt) }}</span>
            </div>
          </article>
        </div>
        <div class="text-center mt-lg">
          <NuxtLink to="/noticias" class="btn btn-secondary">
            Ver Todas las Noticias
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- Quiénes Somos Preview -->
    <section class="section section-alt">
      <div class="container">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 class="section-title">{{ quienesSomos.titulo || 'Quiénes Somos' }}</h2>
          <p class="text-muted" style="font-size: 1.125rem; line-height: 1.7;">
            {{ quienesSomos.contenido || 'Somos una comunidad dedicada a conectar personas, compartir conocimiento y promover la innovación tecnológica en Chile.' }}
          </p>
          <NuxtLink to="/quienes-somos" class="btn btn-primary mt-lg">
            Conoce Más
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 style="margin-bottom: 16px;">¿Listo para unirte?</h2>
        <p class="text-muted mb-lg">
          Regístrate hoy y forma parte de nuestra creciente comunidad.
        </p>
        <NuxtLink to="/registro" class="btn btn-primary btn-lg">
          Crear Cuenta
        </NuxtLink>
      </div>
    </section>
    
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
const { data: seccionesData } = await useFetch('/api/secciones')
const { data: noticiasData } = await useFetch('/api/noticias', {
  query: { limit: 3 }
})

const secciones = computed(() => seccionesData.value || [])
const noticias = computed(() => noticiasData.value?.noticias || [])

const quienesSomos = computed(() => secciones.value.find(s => s.clave === 'quienes_somos') || {
  titulo: 'Quiénes Somos',
  contenido: 'Somos una comunidad dedicada a conectar personas, compartir conocimiento y promover la innovación tecnológica en Chile.'
})

const hero = computed(() => secciones.value.find(s => s.clave === 'hero') || {
  titulo: 'Bienvenido a Comunidad Chile',
  subtitulo: 'Conectando personas, compartiendo conocimiento, innovando juntos.'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
