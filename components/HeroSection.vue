<template>
  <section class="hero">
    <!-- Slider -->
    <div class="hero-slider">
      <div
        class="hero-slide"
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="{ active: currentSlide === index }"
      >
        <img :src="slide.image" :alt="slide.title" class="hero-slide-image" />
        <div class="hero-slide-overlay"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="container hero-content">
      <div class="hero-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Comunidad líder en innovación
      </div>

      <transition name="slide-fade" mode="out-in">
        <div :key="currentSlide" class="hero-text-content">
          <h1 class="hero-title">{{ currentSlideData.title }}</h1>
          <p class="hero-subtitle">{{ currentSlideData.subtitle }}</p>
        </div>
      </transition>

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

      <!-- Slider Controls -->
      <div class="hero-slider-controls">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="hero-slider-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Ir a slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- Arrow Navigation -->
    <button class="hero-arrow hero-arrow-prev" @click="prevSlide" aria-label="Slide anterior">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="hero-arrow hero-arrow-next" @click="nextSlide" aria-label="Slide siguiente">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
const { data: seccionesData } = await useFetch('/api/secciones')

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80',
    title: 'Bienvenido a Nuestra Comunidad',
    subtitle: 'Un espacio para conectar, aprender y crecer juntos en el mundo de la tecnología.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80',
    title: 'Innovación y Tecnología',
    subtitle: 'Descubre las últimas tendencias y únete a conversaciones que正在改变我们的未来.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80',
    title: 'Aprende y Comparte',
    subtitle: 'Talleres, charlas y eventos diseñados para potenciar tu crecimiento profesional.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80',
    title: 'Conecta con Expertos',
    subtitle: 'Forma parte de una red de profesionales y entusiastas de la tecnología.'
  }
]

// Override with DB content if available
const heroFromDB = computed(() => seccionesData.value?.find((s: any) => s.clave === 'hero'))

const currentSlideData = computed(() => {
  const slide = slides[currentSlide.value]
  if (heroFromDB.value) {
    return {
      title: heroFromDB.value.titulo || slide.title,
      subtitle: heroFromDB.value.subtitulo || slide.subtitle
    }
  }
  return slide
})

const currentSlide = ref(0)
let autoplayInterval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetAutoplay()
}

const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 5000)
}

const resetAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
})
</script>

<style scoped>
/* Hero Slider */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #0a0a0f;
}

.hero-slider {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.hero-slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 15, 0.85) 0%,
    rgba(10, 10, 15, 0.6) 50%,
    rgba(10, 10, 15, 0.8) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 80px 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 117, 222, 0.15);
  border: 1px solid rgba(0, 117, 222, 0.3);
  border-radius: 9999px;
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.hero-badge svg {
  color: #fbbf24;
}

.hero-text-content {
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 0 60px;
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
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.hero-stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.hero-stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Slider Controls */
.hero-slider-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 48px;
}

.hero-slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.hero-slider-dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.hero-slider-dot.active {
  background: #0075de;
  transform: scale(1.2);
}

/* Arrow Navigation */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.hero-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.hero-arrow-prev {
  left: 24px;
}

.hero-arrow-next {
  right: 24px;
}

/* Slide Transition */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 640px) {
  .hero {
    min-height: 70vh;
  }

  .hero-arrow {
    display: none;
  }

  .hero-stats {
    gap: 20px;
  }

  .hero-stat-divider {
    display: none;
  }

  .hero-slider-controls {
    margin-top: 32px;
  }
}
</style>
