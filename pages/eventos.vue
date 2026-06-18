<template>
  <div>
    <AppNavbar />
    <div class="container" style="padding-top: 48px; padding-bottom: 64px;">
      <h1 class="page-title">Eventos y Reuniones</h1>
      <p class="page-subtitle">Calendario de actividades vecinales en Villa Arrayan</p>

      <div class="eventos-grid">
        <div
          v-for="evt in eventos"
          :key="evt.id"
          class="evento-card"
        >
          <div class="evento-card-date">
            <span class="evento-card-dia">{{ formatDay(evt.fecha) }}</span>
            <span class="evento-card-mes">{{ formatMonth(evt.fecha) }}</span>
          </div>
          <div class="evento-card-body">
            <span class="badge" :class="`badge-${getCategoriaColor(evt.categoria)}`">
              {{ getCategoriaLabel(evt.categoria) }}
            </span>
            <h3 class="evento-card-titulo">{{ evt.titulo }}</h3>
            <p class="evento-card-desc">{{ evt.descripcion }}</p>
            <div class="evento-card-meta">
              <span v-if="evt.hora" class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ evt.hora }}
              </span>
              <span v-if="evt.lugar" class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ evt.lugar }}
              </span>
              <span v-if="evt.capMax" class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                {{ evt.capMax }} cupos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="eventos.length === 0" class="empty">
        <p>No hay eventos programados.</p>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/eventos')
const eventos = computed(() => data.value?.eventos || [])

function formatDay(date: string) {
  return new Date(date).getDate()
}
function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('es-CL', { month: 'short' })
}
function getCategoriaColor(cat: string) {
  const map: Record<string, string> = {
    REUNION: 'info',
    FIESTA: 'success',
    MANTENCION: 'warning',
    EMERGENCIA: 'danger',
    OTRO: 'default',
  }
  return map[cat] || 'default'
}
function getCategoriaLabel(cat: string) {
  const map: Record<string, string> = {
    REUNION: 'Reunion',
    FIESTA: 'Fiesta',
    MANTENCION: 'Mantención',
    EMERGENCIA: 'Emergencia',
    OTRO: 'Otro',
  }
  return map[cat] || cat
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
.eventos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.evento-card {
  display: flex;
  gap: 20px;
  background: white;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 24px;
}
.evento-card-date {
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
.evento-card-dia {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}
.evento-card-mes {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}
.evento-card-body {
  flex: 1;
}
.evento-card-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 6px 0 6px;
}
.evento-card-desc {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}
.evento-card-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: #888;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #888;
}
</style>
