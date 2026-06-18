<template>
  <div>
    <AppNavbar />
    <div class="container" style="padding-top: 48px; padding-bottom: 64px;">
      <NuxtLink to="/comunicados" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver a comunicados
      </NuxtLink>

      <div v-if="com" class="com-detail">
        <div class="com-detail-header">
          <div v-if="com.esPinned" class="com-pinned-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Comunicado destacado
          </div>
          <p class="com-detail-date">{{ formatDate(com.fechaPublicacion || com.createdAt) }}</p>
          <h1 class="com-detail-title">{{ com.titulo }}</h1>
        </div>

        <div v-if="com.imagenUrl" class="com-detail-image">
          <img :src="com.imagenUrl" :alt="com.titulo" />
        </div>

        <div class="com-detail-content">
          <p>{{ com.contenido }}</p>
        </div>
      </div>

      <div v-else class="not-found">
        <p>Comunicado no encontrado.</p>
        <NuxtLink to="/comunicados" class="btn btn-secondary">Volver</NuxtLink>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/comunicados/${route.params.id}`)
const com = computed(() => data.value?.comunicado)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-decoration: none;
  margin-bottom: 32px;
}
.back-link:hover { color: #0075de; }
.com-detail {
  max-width: 720px;
  margin: 0 auto;
}
.com-detail-header {
  margin-bottom: 32px;
}
.com-pinned-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 12px;
  text-transform: uppercase;
}
.com-detail-date {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 8px;
}
.com-detail-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.com-detail-image {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 32px;
}
.com-detail-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
}
.com-detail-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}
.com-detail-content p {
  white-space: pre-line;
  margin-bottom: 16px;
}
.not-found {
  text-align: center;
  padding: 80px;
  color: #888;
}
</style>
