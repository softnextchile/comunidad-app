<template>
  <section class="hero">
    <div class="hero-bg">
      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80"
        alt="Villa Arrayán"
        class="hero-img"
      />
      <div class="hero-overlay"></div>
    </div>

    <div class="container hero-content">
      <div class="hero-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Junta de Vecinos Villa Arrayán
      </div>

      <h1 class="hero-title">{{ hero.titulo || 'Tu barrio conectado, siempre informados' }}</h1>
      <p class="hero-subtitle">{{ hero.subtitulo || 'Comunicados, eventos y servicios para los vecinos de Villa Arrayán.' }}</p>

      <div class="hero-actions">
        <a href="#comunicados" class="btn btn-primary btn-lg">
          Ver Comunicados
        </a>
        <a href="#contacto" class="btn btn-outline-light btn-lg">
          Contactar a la Junta
        </a>
      </div>

      <div class="hero-social-proof">
        <span class="hero-proof-number">{{ totalResidentes }}+</span>
        <span class="hero-proof-label">vecinos registrados</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: seccionesData } = await useFetch('/api/secciones')

const hero = computed(() =>
  seccionesData.value?.find((s: any) => s.clave === 'hero') || {}
)

const { data: userData } = await useFetch('/api/auth/me')
const totalResidentes = computed(() => userData.value?.total || 0)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 15, 0.85) 0%,
    rgba(10, 10, 15, 0.65) 50%,
    rgba(10, 10, 15, 0.80) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 100px 0 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 117, 222, 0.2);
  border: 1px solid rgba(0, 117, 222, 0.4);
  border-radius: 9999px;
  color: #93c5fd;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
}

.hero-badge svg {
  color: #fbbf24;
}

.hero-title {
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
  line-height: 1.15;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.75);
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.btn-outline-light {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.6);
  color: white;
}

.hero-social-proof {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero-proof-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.hero-proof-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

@media (max-width: 640px) {
  .hero-content {
    padding: 80px 0 60px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  .btn-outline-light,
  .btn-primary {
    width: 100%;
    max-width: 280px;
  }
}
</style>
