<template>
  <div>
    <AppNavbar />
    <HeroSection />

    <!-- Comunicados -->
    <section id="comunicados" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Comunicados de la Junta</h2>
          <p class="section-subtitle">Avisos oficiales para todos los vecinos</p>
        </div>
        <div class="comunicados-grid">
          <article
            v-for="com in comunicados"
            :key="com.id"
            class="com-card"
            :class="{ pinned: com.esPinned }"
          >
            <div v-if="com.esPinned" class="com-card-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Destacado
            </div>
            <div class="com-card-date">{{ formatDate(com.fechaPublicacion || com.createdAt) }}</div>
            <h3 class="com-card-title">{{ com.titulo }}</h3>
            <p class="com-card-resumen">{{ com.resumen }}</p>
            <NuxtLink :to="`/comunicados/${com.id}`" class="com-card-link">
              Leer más
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </NuxtLink>
          </article>
        </div>
        <div class="text-center mt-lg">
          <NuxtLink to="/comunicados" class="btn btn-secondary btn-lg">
            Ver todos los comunicados
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Eventos -->
    <section id="eventos" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Próximos Eventos</h2>
          <p class="section-subtitle">Reuniones, fiestas y actividades vecinales</p>
        </div>
        <div class="eventos-list">
          <div
            v-for="evt in eventos"
            :key="evt.id"
            class="evento-item"
          >
            <div class="evento-date-block">
              <span class="evento-dia">{{ formatDay(evt.fecha) }}</span>
              <span class="evento-mes">{{ formatMonth(evt.fecha) }}</span>
            </div>
            <div class="evento-info">
              <div class="evento-tags">
                <span class="badge" :class="`badge-${getCategoriaColor(evt.categoria)}`">
                  {{ getCategoriaLabel(evt.categoria) }}
                </span>
              </div>
              <h3 class="evento-titulo">{{ evt.titulo }}</h3>
              <p class="evento-desc">{{ evt.descripcion }}</p>
              <div class="evento-meta">
                <span v-if="evt.hora" class="evento-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ evt.hora }}
                </span>
                <span v-if="evt.lugar" class="evento-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ evt.lugar }}
                </span>
                <span v-if="evt.capMax" class="evento-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {{ evt.capMax }} cupos
                </span>
              </div>
            </div>
          </div>
          <div v-if="eventos.length === 0" class="empty-state">
            <p>No hay eventos próximos programados.</p>
          </div>
        </div>
        <div class="text-center mt-lg">
          <NuxtLink to="/eventos" class="btn btn-secondary btn-lg">
            Ver calendario completo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Servicios -->
    <section id="servicios" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Directorio de Servicios</h2>
          <p class="section-subtitle">Contactos útiles para los vecinos</p>
        </div>
        <div class="servicios-grid">
          <div
            v-for="svc in servicios"
            :key="svc.id"
            class="servicio-card"
          >
            <div class="servicio-icon" :class="`icon-${svc.categoria.toLowerCase()}`">
              <component :is="getCategoriaIcon(svc.categoria)" />
            </div>
            <div class="servicio-info">
              <h3 class="servicio-nombre">{{ svc.nombre }}</h3>
              <p v-if="svc.descripcion" class="servicio-desc">{{ svc.descripcion }}</p>
              <a :href="`tel:${svc.telefono.replace(/\s/g,'')}`" class="servicio-tel">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ svc.telefono }}
              </a>
              <a v-if="svc.email" :href="`mailto:${svc.email}`" class="servicio-email">
                {{ svc.email }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Contacto</h2>
          <p class="section-subtitle">Escríbenos y te responderemos a la brevedad</p>
        </div>
        <div class="contact-layout">
          <form class="contact-form" @submit.prevent="enviarMensaje">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-input"
                placeholder="Tu nombre completo"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="tu@email.cl"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono (opcional)</label>
              <input
                v-model="form.telefono"
                type="tel"
                class="form-input"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Mensaje</label>
              <textarea
                v-model="form.mensaje"
                class="form-input"
                rows="4"
                placeholder="¿En qué podemos ayudarte?"
                required
              ></textarea>
            </div>
            <div v-if="enviado" class="form-success">
              Mensaje enviado con éxito. Te responderemos pronto.
            </div>
            <div v-if="error" class="form-error">{{ error }}</div>
            <button type="submit" class="btn btn-primary btn-lg" :disabled="cargando">
              {{ cargando ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </form>
          <div class="contact-info">
            <div class="contact-info-card">
              <h3>Junta de Vecinos</h3>
              <p class="contact-info-name">Villa Arrayán</p>
              <div class="contact-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Av. Villa Arrayán 1234, Santiago
              </div>
              <div class="contact-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                junta@villaarrayan.cl
              </div>
              <div class="contact-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Lunes a Viernes 9:00 - 18:00 hrs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { data: comunicadosData } = await useFetch('/api/comunicados', { query: { limit: 3 } })
const { data: eventosData } = await useFetch('/api/eventos', { query: { upcoming: true } })
const { data: serviciosData } = await useFetch('/api/servicios')

const comunicados = computed(() => comunicadosData.value?.comunicados || [])
const eventos = computed(() => eventosData.value?.eventos || [])
const servicios = computed(() => serviciosData.value?.servicios || [])

const form = reactive({ nombre: '', email: '', telefono: '', mensaje: '' })
const cargando = ref(false)
const enviado = ref(false)
const error = ref('')

async function enviarMensaje() {
  cargando.value = true
  error.value = ''
  try {
    await $fetch('/api/contactos', { method: 'POST', body: form })
    enviado.value = true
    form.nombre = ''
    form.email = ''
    form.telefono = ''
    form.mensaje = ''
    setTimeout(() => { enviado.value = false }, 5000)
  } catch (e: any) {
    error.value = e.data?.message || 'Error al enviar el mensaje'
  } finally {
    cargando.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

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
    REUNION: 'Reunión',
    FIESTA: 'Fiesta',
    MANTENCION: 'Mantención',
    EMERGENCIA: 'Emergencia',
    OTRO: 'Otro',
  }
  return map[cat] || cat
}

function getCategoriaIcon(cat: string) {
  return 'div'
}
</script>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-subtitle {
  color: #666;
  font-size: 1.0625rem;
  margin-top: -12px;
}

/* Comunicados */
.comunicados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.com-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  position: relative;
}

.com-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.com-card.pinned {
  border-color: rgba(0, 117, 222, 0.3);
  background: #f8fbff;
}

.com-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #0075de;
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 4px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.com-card-badge svg {
  color: #fbbf24;
}

.com-card-date {
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 8px;
}

.com-card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.4;
}

.com-card-resumen {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.com-card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0075de;
  text-decoration: none;
}

.com-card-link:hover {
  color: #005bab;
}

/* Eventos */
.eventos-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evento-item {
  display: flex;
  gap: 20px;
  background: white;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.evento-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}

.evento-date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  background: #0075de;
  border-radius: 10px;
  padding: 8px 12px;
  color: white;
}

.evento-dia {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.evento-mes {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
}

.evento-info {
  flex: 1;
}

.evento-tags {
  margin-bottom: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-info { background: #f0f7ff; color: #0075de; }
.badge-success { background: #f0fdf4; color: #16a34a; }
.badge-warning { background: #fffbeb; color: #d97706; }
.badge-danger { background: #fef2f2; color: #dc2626; }
.badge-default { background: #f4f4f4; color: #555; }

.evento-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.evento-desc {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.evento-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.evento-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: #888;
}

/* Servicios */
.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.servicio-card {
  display: flex;
  gap: 16px;
  background: white;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.servicio-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}

.servicio-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.icon-gasfiter { background: #dbeafe; color: #2563eb; }
.icon-electricista { background: #fef9c3; color: #ca8a04; }
.icon-emergencia { background: #fee2e2; color: #dc2626; }
.icon-comun { background: #dcfce7; color: #16a34a; }
.icon-otro { background: #f4f4f4; color: #555; }

.servicio-info {
  flex: 1;
}

.servicio-nombre {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.servicio-desc {
  font-size: 0.8125rem;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.servicio-tel {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0075de;
  text-decoration: none;
  margin-bottom: 4px;
}

.servicio-email {
  display: block;
  font-size: 0.8125rem;
  color: #888;
  text-decoration: none;
  margin-top: 4px;
}

/* Contacto */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
}

.contact-form {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 32px;
}

.form-success {
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #16a34a;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.form-error {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.contact-info-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 28px;
}

.contact-info-card h3 {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.contact-info-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.5;
}

.contact-info-item svg {
  color: #0075de;
  flex-shrink: 0;
  margin-top: 2px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .evento-item {
    flex-direction: column;
    gap: 12px;
  }
  .evento-date-block {
    flex-direction: row;
    gap: 8px;
    min-width: auto;
    width: fit-content;
  }
  .comunicados-grid {
    grid-template-columns: 1fr;
  }
}
</style>
