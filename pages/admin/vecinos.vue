<template>
  <div>
    <AdminLayout>
      <div class="page-header">
        <h1 class="page-title">Vecinos</h1>
        <button class="btn-primary" @click="showCreate = true">+ Crear Vecino</button>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Casa</th>
              <th>Email validado</th>
              <th>Solicitudes</th>
              <th>Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in items" :key="v.id">
              <td class="td-name">{{ v.nombre }}</td>
              <td class="td-email">{{ v.email }}</td>
              <td>{{ v.numeroCasa || '—' }}</td>
              <td>
                <span class="badge" :class="v.emailValidado ? 'badge-green' : 'badge-red'">
                  {{ v.emailValidado ? '✓ Validado' : '✗ Pendiente' }}
                </span>
              </td>
              <td class="td-center">{{ v._count?.solicitudes || 0 }}</td>
              <td class="td-date">{{ formatDate(v.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="items.length === 0" class="empty">No hay vecinos registrados</div>
      </div>

      <!-- Create modal -->
      <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Crear Vecino</h3>
            <button class="btn-close" @click="showCreate = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre completo *</label>
              <input v-model="form.nombre" type="text" placeholder="Nombre del vecino" />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="form.email" type="email" placeholder="email@ejemplo.cl" />
            </div>
            <div class="form-group">
              <label>Número de casa</label>
              <input v-model="form.numeroCasa" type="text" placeholder="Ej: 42-A" />
            </div>
            <div class="form-group">
              <label>Contraseña provisional <span class="hint">(opcional)</span></label>
              <input v-model="form.password" type="text" placeholder="Dejar vacío para usar 'vecino2024'" />
              <p class="form-hint">Si se deja vacía, la contraseña será "vecino2024"</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="showCreate = false">Cancelar</button>
            <button class="btn-primary" :disabled="saving" @click="crearVecino">
              {{ saving ? 'Creando...' : 'Crear Vecino' }}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([])
const showCreate = ref(false)
const saving = ref(false)

const form = reactive({ nombre: '', email: '', numeroCasa: '', password: '' })

async function load() {
  const data = await $fetch<any>('/api/admin/vecinos')
  items.value = data.items
}

async function crearVecino() {
  if (!form.nombre || !form.email) return
  saving.value = true
  try {
    await $fetch('/api/admin/vecinos', { method: 'POST', body: form })
    showCreate.value = false
    Object.assign(form, { nombre: '', email: '', numeroCasa: '', password: '' })
    await load()
  } finally {
    saving.value = false
  }
}

function formatDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(load)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 1.5rem; font-weight: 700; color: #fff; }
.btn-primary { background: #0075de; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }
.btn-secondary { background: #1a1d21; color: #fff; border: 1px solid #2a2d31; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; }
.btn-secondary:disabled, .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.table-card { background: #111318; border: 1px solid #1a1d21; border-radius: 12px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; color: #888; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #1a1d21; }
.table td { padding: 14px 16px; font-size: 0.875rem; color: #ccc; border-bottom: 1px solid #1a1d21;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #16181c; }
.td-name { color: #fff; font-weight: 500; }
.td-email { color: #888; font-size: 0.8rem; }
.td-center { text-align: center; color: #888; }
.td-date { color: #888; font-size: 0.8rem; }
.badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.badge-green { background: rgba(0,200,83,0.15); color: #00c853; }
.badge-red { background: rgba(255, 59, 48, 0.15); color: #ff4444; }
.empty { padding: 40px; text-align: center; color: #888; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
.modal { background: #111318; border: 1px solid #1a1d21; border-radius: 16px; width: 480px; max-width: 95vw; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #1a1d21; }
.modal-header h3 { font-size: 1rem; font-weight: 600; color: #fff; }
.btn-close { background: none; border: none; color: #888; cursor: pointer; font-size: 1rem; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #1a1d21; display: flex; justify-content: flex-end; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; color: #888; font-weight: 500; }
.form-group input { background: #0a0c0f; border: 1px solid #1a1d21; border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.875rem; }
.form-group input:focus { outline: none; border-color: #0075de; }
.hint { color: #555; font-weight: 400; }
.form-hint { font-size: 0.75rem; color: #555; margin: 4px 0 0; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .table-card { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .modal { width: 98vw !important; max-height: 95vh; }
  .modal-overlay { padding: 8px; align-items: flex-end; }
  .modal-body { padding: 16px; }
  .modal-footer { padding: 12px 16px; }
  .page-header { flex-wrap: wrap; gap: 12px; }
  .page-header .btn-primary { width: 100%; text-align: center; justify-content: center; }
  .form-group input, .form-group textarea, .form-group select { font-size: 16px; }
}
@media (max-width: 480px) {
  .admin-main { padding: 16px 12px; padding-top: 72px; }
  .table th, .table td { padding: 10px 12px; font-size: 0.8rem; }
  .modal { border-radius: 12px 12px 0 0; }
}

</style>
