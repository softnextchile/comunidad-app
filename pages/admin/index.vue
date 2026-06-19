<template>
  <div>
    <AdminLayout>
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen de la comunidad</p>
      </div>

      <!-- Stats grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <div class="stat-body">
            <span class="stat-value">{{ stats.comunicados }}</span>
            <span class="stat-label">Comunicados</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📅</span>
          <div class="stat-body">
            <span class="stat-value">{{ stats.eventos }}</span>
            <span class="stat-label">Eventos</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔧</span>
          <div class="stat-body">
            <span class="stat-value">{{ stats.servicios }}</span>
            <span class="stat-label">Servicios</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📬</span>
          <div class="stat-body">
            <span class="stat-value">{{ stats.solicitudes }}</span>
            <span class="stat-label">Solicitudes</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <div class="stat-body">
            <span class="stat-value">{{ stats.vecinos }}</span>
            <span class="stat-label">Vecinos</span>
          </div>
        </div>
      </div>

      <!-- Solicitudes recientes -->
      <div class="section">
        <h2 class="section-title">Solicitudes Recientes</h2>
        <div v-if="solicitudes.length === 0" class="empty-state">
          No hay solicitudes aún
        </div>
        <div v-else class="solicitudes-list">
          <div v-for="s in solicitudes.slice(0, 5)" :key="s.id" class="solicitud-row">
            <div class="solicitud-info">
              <span class="solicitud-titulo">{{ s.titulo }}</span>
              <span class="solicitud-meta">{{ s.solicitante?.nombre }} · {{ s.tipo }}</span>
            </div>
            <span class="badge" :class="badgeClass(s.estado)">{{ s.estado }}</span>
          </div>
        </div>
        <NuxtLink to="/admin/solicitudes" class="see-all">Ver todas →</NuxtLink>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
const stats = reactive({ comunicados: 0, eventos: 0, servicios: 0, solicitudes: 0, vecinos: 0 })
const solicitudes = ref<any[]>([])

onMounted(async () => {
  const [com, eve, ser, sol, vec] = await Promise.all([
    $fetch<any>('/api/admin/comunicados'),
    $fetch<any>('/api/admin/eventos'),
    $fetch<any>('/api/admin/servicios'),
    $fetch<any>('/api/admin/solicitudes'),
    $fetch<any>('/api/admin/vecinos'),
  ])
  stats.comunicados = com.total
  stats.eventos = eve.total
  stats.servicios = ser.total
  stats.solicitudes = sol.total
  stats.vecinos = vec.total
  solicitudes.value = sol.items
})

function badgeClass(estado: string) {
  if (estado === 'ABIERTA') return 'badge-red'
  if (estado === 'EN_PROCESO') return 'badge-yellow'
  return 'badge-green'
}
</script>

<style scoped>
.page-header { margin-bottom: 32px; }
.page-title { font-size: 1.75rem; font-weight: 700; color: #fff; }
.page-subtitle { color: #888; margin-top: 4px; font-size: 0.9rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  background: #111318;
  border: 1px solid #1a1d21;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon { font-size: 1.75rem; }
.stat-body { display: flex; flex-direction: column; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #fff; }
.stat-label { font-size: 0.8rem; color: #888; margin-top: 2px; }

.section { background: #111318; border: 1px solid #1a1d21; border-radius: 12px; padding: 24px; }
.section-title { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 16px; }

.empty-state { color: #888; font-size: 0.875rem; text-align: center; padding: 24px; }

.solicitudes-list { display: flex; flex-direction: column; gap: 12px; }

.solicitud-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #1a1d21;
}

.solicitud-row:last-child { border-bottom: none; }

.solicitud-info { display: flex; flex-direction: column; gap: 2px; }
.solicitud-titulo { font-size: 0.875rem; font-weight: 500; color: #fff; }
.solicitud-meta { font-size: 0.75rem; color: #888; }

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.badge-red { background: rgba(255, 59, 48, 0.15); color: #ff4444; }
.badge-yellow { background: rgba(255, 180, 0, 0.15); color: #ffb400; }
.badge-green { background: rgba(0, 200, 83, 0.15); color: #00c853; }

.see-all {
  display: inline-block;
  margin-top: 16px;
  font-size: 0.8rem;
  color: #0075de;
  text-decoration: none;
}
.see-all:hover { text-decoration: underline; }
</style>
