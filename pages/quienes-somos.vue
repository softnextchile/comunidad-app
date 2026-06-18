<template>
  <div>
    <AppNavbar />
    
    <section class="section" style="background: var(--color-warm-white); padding: 48px 0;">
      <div class="container text-center">
        <h1 class="section-title">{{ quienesSomos.titulo || 'Quiénes Somos' }}</h1>
        <p class="text-muted" style="max-width: 600px; margin: 0 auto;">
          {{ quienesSomos.subtitulo || 'Conoce nuestra historia y misión' }}
        </p>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div style="max-width: 800px; margin: 0 auto;">
          <div class="card mb-lg">
            <h2 style="margin-bottom: 16px;">Nuestra Historia</h2>
            <p class="text-muted" style="line-height: 1.8;">
              {{ quienesSomos.contenido || 'Somos una comunidad fundada con el objetivo de conectar a personas interesadas en tecnología e innovación en Chile. Desde nuestros inicios, hemos trabajado para crear un espacio donde todos puedan aprender, compartir y crecer juntos.' }}
            </p>
          </div>
          
          <div class="section-grid">
            <div class="card">
              <h3 style="margin-bottom: 12px;">🎯 Misión</h3>
              <p class="text-muted">
                Promover la educación tecnológica y facilitar conexiones significativas entre profesionales y entusiastas de la tecnología en Chile.
              </p>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 12px;">👁️ Visión</h3>
              <p class="text-muted">
                Ser la comunidad de referencia en innovación y tecnología en Latinoamérica, impulsando el desarrollo de soluciones creativas y sostenibles.
              </p>
            </div>
          </div>
          
          <div class="card mt-lg">
            <h3 style="margin-bottom: 16px;">Nuestros Valores</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border-light);">
                <strong>Colaboración:</strong> Creemos en el poder del trabajo en equipo.
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border-light);">
                <strong>Innovación:</strong> Buscamos soluciones creativas a problemas reales.
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border-light);">
                <strong>Inclusión:</strong> Todos son bienvenidos en nuestra comunidad.
              </li>
              <li style="padding: 8px 0;">
                <strong>Aprendizaje:</strong> Fomentamos la educación continua y el crecimiento personal.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
const { fetchSecciones, getSeccion } = useSecciones()
const quienesSomos = getSeccion('quienes_somos')

onMounted(() => {
  fetchSecciones()
})
</script>
