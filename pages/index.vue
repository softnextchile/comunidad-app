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
            <div class="news-card-image-wrapper">
              <img
                v-if="noticia.imagenUrl"
                :src="noticia.imagenUrl"
                :alt="noticia.titulo"
                class="news-card-image"
              />
              <img
                v-else
                :src="getPlaceholderImage(noticia.id)"
                :alt="noticia.titulo"
                class="news-card-image"
              />
              <div class="news-card-category">Noticias</div>
            </div>
            <div class="news-card-content">
              <h3 class="news-card-title">{{ noticia.titulo }}</h3>
              <p class="news-card-excerpt">{{ noticia.resumen }}</p>
              <div class="news-card-footer">
                <span class="news-card-author">{{ noticia.autor || 'Comunidad' }}</span>
                <span class="news-card-date">{{ formatDate(noticia.createdAt) }}</span>
              </div>
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
        <div class="about-preview">
          <div class="about-preview-image">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Nuestra comunidad"
            />
            <div class="about-preview-badge">
              <span class="badge-number">5+</span>
              <span class="badge-text">Años de<br>experiencia</span>
            </div>
          </div>
          <div class="about-preview-content">
            <h2 class="about-preview-title">{{ quienesSomos.titulo || 'Quiénes Somos' }}</h2>
            <p class="about-preview-text">
              {{ quienesSomos.contenido || 'Somos una comunidad dedicada a conectar personas, compartir conocimiento y promover la innovación tecnológica en Chile.' }}
            </p>
            <div class="about-preview-features">
              <div class="about-feature">
                <div class="about-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h4>Comunidad Activa</h4>
                  <p>Más de 500 miembros conectados</p>
                </div>
              </div>
              <div class="about-feature">
                <div class="about-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div>
                  <h4>Aprendizaje Continuo</h4>
                  <p>Talleres y charlas mensuales</p>
                </div>
              </div>
              <div class="about-feature">
                <div class="about-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <h4>Innovación</h4>
                  <p>Proyectos colaborativos</p>
                </div>
              </div>
            </div>
            <NuxtLink to="/quienes-somos" class="btn btn-primary mt-lg">
              Conoce Más
            </NuxtLink>
          </div>
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

const placeholderImages = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
]

const getPlaceholderImage = (id: number) => {
  return placeholderImages[id % placeholderImages.length]
}
</script>
