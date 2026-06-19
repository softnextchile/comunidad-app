<template>
  <div>
    <AdminLayout>
      <div class="page-header">
        <h1 class="page-title">Comunicados</h1>
        <button class="btn-primary" @click="openCreate">+ Nuevo Comunicado</button>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Destacado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="td-title">{{ item.titulo }}</td>
              <td>
                <span class="badge" :class="item.publicado ? 'badge-green' : 'badge-gray'">
                  {{ item.publicado ? 'Publicado' : 'Borrador' }}
                </span>
              </td>
              <td>
                <span v-if="item.esPinned" class="pin-icon">📌</span>
              </td>
              <td class="td-date">{{ formatDate(item.fechaPublicacion) }}</td>
              <td class="td-actions">
                <button class="btn-icon" @click="openEdit(item)">✏️</button>
                <button class="btn-icon btn-danger" @click="confirmDelete(item)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="items.length === 0" class="empty">No hay comunicados</div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editing ? 'Editar Comunicado' : 'Nuevo Comunicado' }}</h3>
            <button class="btn-close" @click="showModal = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Título *</label>
              <input v-model="form.titulo" type="text" placeholder="Título del comunicado" />
            </div>
            <div class="form-group">
              <label>Resumen *</label>
              <textarea v-model="form.resumen" placeholder="Resumen breve" rows="2" />
            </div>
            <div class="form-group">
              <label>Contenido *</label>
              <textarea v-model="form.contenido" placeholder="Contenido completo" rows="6" />
            </div>
            <div class="form-group">
              <label>URL de Imagen</label>
              <input v-model="form.imagenUrl" type="text" placeholder="https://..." />
              <div v-if="form.imagenUrl" class="img-preview">
                <img :src="form.imagenUrl" alt="Preview" @error="form.imagenUrl = ''" />
              </div>
            </div>
            <div class="form-row">
              <label class="checkbox-label">
                <input v-model="form.publicado" type="checkbox" />
                Publicado
              </label>
              <label class="checkbox-label">
                <input v-model="form.esPinned" type="checkbox" />
                Destacado / Pinned
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="showModal = false">Cancelar</button>
            <button class="btn-primary" :disabled="saving" @click="save">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div v-if="showDelete" class="modal-overlay" @click.self="showDelete = false">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3>Eliminar Comunicado</h3>
          </div>
          <div class="modal-body">
            <p>¿Eliminar "<strong>{{ deleting?.titulo }}</strong>"? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="showDelete = false">Cancelar</button>
            <button class="btn-danger" :disabled="saving" @click="doDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([])
const showModal = ref(false)
const showDelete = ref(false)
const editing = ref(false)
const saving = ref(false)
const deleting = ref<any>(null)

const form = reactive({
  titulo: '', resumen: '', contenido: '', imagenUrl: '', publicado: false, esPinned: false, id: null as number | null,
})

async function load() {
  const data = await $fetch<any>('/api/admin/comunicados')
  items.value = data.items
}

function openCreate() {
  editing.value = false
  Object.assign(form, { titulo: '', resumen: '', contenido: '', imagenUrl: '', publicado: false, esPinned: false, id: null })
  showModal.value = true
}

function openEdit(item: any) {
  editing.value = true
  Object.assign(form, { ...item, id: item.id })
  showModal.value = true
}

function confirmDelete(item: any) {
  deleting.value = item
  showDelete.value = true
}

async function save() {
  saving.value = true
  try {
    if (editing.value) {
      await $fetch(`/api/admin/comunicados/${form.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/admin/comunicados', { method: 'POST', body: form })
    }
    showModal.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  saving.value = true
  try {
    await $fetch(`/api/admin/comunicados/${deleting.value.id}`, { method: 'DELETE' })
    showDelete.value = false
    await load()
  } finally {
    saving.value = false
  }
}

function formatDate(d: string | Date | null) {
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
.btn-danger { background: rgba(255, 59, 48, 0.15); color: #ff4444; border: 1px solid rgba(255,59,48,0.3); padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; }
.btn-danger:disabled, .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.table-card { background: #111318; border: 1px solid #1a1d21; border-radius: 12px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; color: #888; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #1a1d21; }
.table td { padding: 14px 16px; font-size: 0.875rem; color: #ccc; border-bottom: 1px solid #1a1d21; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #16181c; }
.td-title { color: #fff; font-weight: 500; }
.td-date { color: #888; font-size: 0.8rem; }
.td-actions { display: flex; gap: 8px; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 0.9rem; padding: 4px; border-radius: 4px; }
.btn-icon:hover { background: #1a1d21; }
.btn-danger.btn-icon { background: rgba(255,59,48,0.1); }
.badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.badge-green { background: rgba(0,200,83,0.15); color: #00c853; }
.badge-gray { background: rgba(150,150,150,0.15); color: #888; }
.pin-icon { font-size: 0.9rem; }
.empty { padding: 40px; text-align: center; color: #888; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
.modal { background: #111318; border: 1px solid #1a1d21; border-radius: 16px; width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
.modal-sm { width: 400px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #1a1d21; }
.modal-header h3 { font-size: 1rem; font-weight: 600; color: #fff; }
.btn-close { background: none; border: none; color: #888; cursor: pointer; font-size: 1rem; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #1a1d21; display: flex; justify-content: flex-end; gap: 12px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; color: #888; font-weight: 500; }
.form-group input[type="text"], .form-group textarea { background: #0a0c0f; border: 1px solid #1a1d21; border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.875rem; resize: vertical; }
.form-group input[type="text"]:focus, .form-group textarea:focus { outline: none; border-color: #0075de; }
.form-row { display: flex; gap: 24px; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #ccc; cursor: pointer; }
.img-preview img { max-width: 200px; max-height: 120px; border-radius: 8px; margin-top: 8px; object-fit: cover; }

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
