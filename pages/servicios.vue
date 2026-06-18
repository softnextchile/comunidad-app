<template>
  <div>
    <AppNavbar />
    <div class="container" style="padding-top: 48px; padding-bottom: 64px;">
      <h1 class="page-title">Directorio de Servicios</h1>
      <p class="page-subtitle">Contactos utiles para los vecinos de Villa Arrayan</p>

      <div class="servicios-full-grid">
        <div
          v-for="svc in servicios"
          :key="svc.id"
          class="servicio-full-card"
        >
          <div class="servicio-full-icon" :class="`icon-${svc.categoria.toLowerCase()}`">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div class="servicio-full-info">
            <span class="badge" :class="`badge-${getCategoriaColor(svc.categoria)}`">
              {{ getCategoriaLabel(svc.categoria) }}
            </span>
            <h3 class="servicio-full-nombre">{{ svc.nombre }}</h3>
            <p v-if="svc.descripcion" class="servicio-full-desc">{{ svc.descripcion }}</p>
            <div class="servicio-full-contact">
              <a :href="`tel:${svc.telefono.replace(/\s/g,'')}`" class="contact-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ svc.telefono }}
              </a>
              <a v-if="svc.email" :href="`mailto:${svc.email}`" class="contact-btn contact-btn-email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                {{ svc.email }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="servicios.length === 0" class="empty">
        <p>No hay servicios registrados.</p>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/servicios')
const servicios = computed(() => data.value?.servicios || [])

function getCategoriaColor(cat: string) {
  const map: Record<string, string> = {
    GASFITER: 'info',
    ELECTRICISTA: 'warning',
    EMERGENCIA: 'danger',
    COMUN: 'success',
    OTRO: 'default',
  }
  return map[cat] || 'default'
}
function getCategoriaLabel(cat: string) {
  const map: Record<string, string> = {
    GASFITER: 'Gasfiter',
    ELECTRICISTA: 'Electricista',
    EMERGENCIA: 'Emergencia',
    COMUN: 'Comun',
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
.servicios-full-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.servicio-full-card {
  display: flex;
  gap: 20px;
  background: white;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}
.servicio-full-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}
.servicio-full-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-gasfiter { background: #dbeafe; color: #2563eb; }
.icon-electricista { background: #fef9c3; color: #ca8a04; }
.icon-emergencia { background: #fee2e2; color: #dc2626; }
.icon-comun { background: #dcfce7; color: #16a34a; }
.icon-otro { background: #f4f4f4; color: #555; }
.servicio-full-info {
  flex: 1;
}
.servicio-full-nombre {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 6px 0 6px;
}
.servicio-full-desc {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}
.servicio-full-contact {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0075de;
  text-decoration: none;
}
.contact-btn-email {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #888;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #888;
}
</style>
