<template>
  <div>
    <AppNavbar />
    <div class="page">
      <div class="container">
        <h1 class="page-title">Mis Solicitudes</h1>

        <div class="actions">
          <button class="btn-primary" @click="showForm = true">+ Nueva Solicitud</button>
        </div>

        <!-- Lista -->
        <div v-if="misSolicitudes.length === 0 && !showForm" class="empty">
          <p>No tienes solicitudes registradas.</p>
          <button class="btn-primary mt" @click="showForm = true">Crear mi primera solicitud</button>
        </div>

        <div v-else class="solicitudes-list">
          <div v-for="s in misSolicitudes" :key="s.id" class="solicitud-card">
            <div class="solicitud-header">
              <span class="type-badge" :class="s.tipo.toLowerCase()">{{ s.tipo }}</span>
              <span class="badge" :class="badgeClass(s.estado)">{{ labelEstado(s.estado) }}</span>
            </div>
            <h3 class="solicitud-title">{{ s.titulo }}</h3>
            <p class="solicitud-desc">{{ s.descripcion }}</p>
            <span class="solicitud-date">{{ formatDate(s.createdAt) }}</span>
          </div>
        </div>

        <!-- Form nueva -->
        <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
          <div class="modal">
            <div class="modal-header">
              <h3>Nueva Solicitud</h3>
              <button class="btn-close" @click="showForm = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Tipo</label>
                <select v-model="form.tipo">
                  <option value="SOLICITUD">Solicitud</option>
                  <option value="RECLAMO">Reclamo</option>
                  <option value="IDEA">Idea</option>
                </select>
              </div>
              <div class="form-group">
                <label>Título *</label>
                <input v-model="form.titulo" type="text" placeholder="Resumen corto" />
              </div>
              <div class="form-group">
                <label>Descripción *</label>
                <textarea v-model="form.descripcion" placeholder="Describe tu solicitud, reclamo o idea..." rows="4" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="showForm = false">Cancelar</button>
              <button class="btn-primary" :disabled="saving" @click="enviar">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, isAuthenticated, fetchUser } = useAuth()
const router = useRouter()
const showForm = ref(false)
const saving = ref(false)
const misSolicitudes = ref<any[]>([])

const form = reactive({ titulo: '', descripcion: '', tipo: 'SOLICITUD' })

onMounted(async () => {
  await fetchUser()
  if (!isAuthenticated.value) { router.push('/login'); return }
  const data = await $fetch<any[]>('/api/solicitudes/mis')
  misSolicitudes.value = data
})

async function enviar() {
  if (!form.titulo || !form.descripcion) return
  saving.value = true
  try {
    const nueva = await $fetch<any>('/api/solicitudes', { method: 'POST', body: form })
    misSolicitudes.value.unshift(nueva)
    showForm.value = false
    Object.assign(form, { titulo: '', descripcion: '', tipo: 'SOLICITUD' })
  } finally {
    saving.value = false
  }
}

function badgeClass(estado: string) {
  if (estado === 'ABIERTA') return 'badge-red'
  if (estado === 'EN_PROCESO') return 'badge-yellow'
  return 'badge-green'
}

function labelEstado(estado: string) {
  if (estado === 'ABIERTA') return 'Abierta'
  if (estado === 'EN_PROCESO') return 'En Proceso'
  return 'Cerrada'
}

function formatDate(d?: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f8f9fa; padding: 40px 16px; }
.container { max-width: 640px; margin: 0 auto; }
.page-title { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin-bottom: 24px; }
.actions { margin-bottom: 24px; }
.btn-primary { background: #0075de; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }
.btn-secondary { background: #fff; color: #333; border: 1px solid #ddd; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
.mt { margin-top: 12px; }
.empty { text-align: center; color: #888; padding: 40px; background: #fff; border-radius: 12px; }
.solicitudes-list { display: flex; flex-direction: column; gap: 16px; }
.solicitud-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.solicitud-header { display: flex; gap: 8px; margin-bottom: 12px; }
.solicitud-title { font-size: 1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; }
.solicitud-desc { font-size: 0.875rem; color: #555; line-height: 1.5; margin-bottom: 12px; }
.solicitud-date { font-size: 0.75rem; color: #aaa; }
.type-badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.type-badge.reclamo { background: rgba(255,59,48,0.1); color: #dc2626; }
.type-badge.solicitud { background: rgba(0,117,222,0.1); color: #0075de; }
.type-badge.idea { background: rgba(0,200,83,0.1); color: #16a34a; }
.badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.badge-red { background: rgba(220,38,38,0.1); color: #dc2626; }
.badge-yellow { background: rgba(234,179,8,0.1); color: #ca8a04; }
.badge-green { background: rgba(22,163,74,0.1); color: #16a34a; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
.modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
.modal-header h3 { font-size: 1rem; font-weight: 600; color: #1a1a2e; }
.btn-close { background: none; border: none; color: #888; cursor: pointer; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; color: #555; font-weight: 500; }
.form-group input, .form-group select, .form-group textarea { border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 0.875rem; resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #0075de; }
</style>
