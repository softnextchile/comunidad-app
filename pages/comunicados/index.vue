<template>
  <div>
    <AppNavbar />
    <div class="container" style="padding-top: 48px; padding-bottom: 64px;">
      <h1 class="page-title">Comunicados</h1>
      <p class="page-subtitle">Avisos oficiales de la Junta de Vecinos Villa Arrayan</p>

      <div class="com-list">
        <article
          v-for="com in comunicados"
          :key="com.id"
          class="com-item"
        >
          <div class="com-date">
            <span class="com-day">{{ formatDay(com.fechaPublicacion || com.createdAt) }}</span>
            <span class="com-month">{{ formatMonth(com.fechaPublicacion || com.createdAt) }}</span>
          </div>
          <div class="com-body">
            <div v-if="com.esPinned" class="com-pinned-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Destacado
            </div>
            <h2 class="com-title">{{ com.titulo }}</h2>
            <p class="com-resumen">{{ com.resumen }}</p>
            <NuxtLink :to="`/comunicados/${com.id}`" class="com-read-more">
              Leer comunicado completo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-if="comunicados.length === 0" class="empty">
        <p>No hay comunicados publicados.</p>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/comunicados')
const comunicados = computed(() => data.value?.comunicados || [])

function formatDay(date: string) {
  return new Date(date).getDate()
}
function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('es-CL', { month: 'short' })
}
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}
.page-subtitle {
  color: #888;
  margin-bottom: 40px;
}
.com-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.com-item {
  display: flex;
  gap: 24px;
  background: white;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}
.com-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}
.com-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  background: #0075de;
  border-radius: 10px;
  padding: 8px 12px;
  color: white;
}
.com-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}
.com-month {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}
.com-body {
  flex: 1;
}
.com-pinned-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.com-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.com-resumen {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}
.com-read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0075de;
  text-decoration: none;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #888;
}
@media (max-width: 640px) {
  .com-item {
    flex-direction: column;
    gap: 12px;
  }
  .com-date {
    flex-direction: row;
    gap: 8px;
    min-width: auto;
    width: fit-content;
  }
}
</style>
