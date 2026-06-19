<template>
  <div>
    <AdminLayout>
      <div class="page-header">
        <h1 class="page-title">Solicitudes y Reclamos</h1>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Vecino</th>
              <th>Casa</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="td-title">{{ item.titulo }}</td>
              <td><span class="type-badge" :class="item.tipo.toLowerCase()">{{ item.tipo }}</span></td>
              <td>{{ item.solicitante?.nombre }}</td>
              <td class="td-casa">{{ item.solicitante?.numeroCasa || '—' }}</td>
              <td>
                <select class="estado-select" :class="item.estado.toLowerCase()" :value="item.estado" @change="cambiarEstado(item, ($event.target as HTMLSelectElement).value)">
                  <option value="ABIERTA">Abierta</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="CERRADA">Cerrada</option>
                </select>
              </td>
              <td class="td-date">{{ formatDate(item.createdAt) }}</td>
              <td>
                <button class="btn-icon" @click="verDetalle(item)">👁️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="items.length === 0" class="empty">No hay solicitudes</div>
      </div>

      <!-- Detalle modal -->
      <div v-if="showDetalle" class="modal-overlay" @click.self="showDetalle = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Detalle de Solicitud</h3>
            <button class="btn-close" @click="showDetalle = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="detalle-row">
              <span class="detalle-label">Título</span>
              <span class="detalle-value">{{ selected?.titulo }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-label">Tipo</span>
              <span class="detalle-value"><span class="type-badge" :class="selected?.tipo.toLowerCase()">{{ selected?.tipo }}</span></span>
            </div>
            <div class="detalle-row">
              <span class="detalle-label">Vecino</span>
              <span class="detalle-value">{{ selected?.solicitante?.nombre }} ({{ selected?.solicitante?.email }})</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-label">Casa</span>
              <span class="detalle-value">{{ selected?.solicitante?.numeroCasa || '—' }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-label">Estado</span>
              <span class="badge" :class="badgeClass(selected?.estado)">{{ selected?.estado }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-label">Fecha</span>
              <span class="detalle-value">{{ formatDate(selected?.createdAt) }}</span>
            </div>
            <div class="detalle-desc">
              <span class="detalle-label">Descripción</span>
              <p class="desc-text">{{ selected?.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([])
const showDetalle = ref(false)
const selected = ref<any>(null)

async function load() {
  const data = await $fetch<any>('/api/admin/solicitudes')
  items.value = data.items
}

function verDetalle(item: any) { selected.value = item; showDetalle.value = true }

async function cambiarEstado(item: any, nuevoEstado: string) {
  await $fetch(`/api/admin/solicitudes/${item.id}`, { method: 'PUT', body: { estado: nuevoEstado } })
  item.estado = nuevoEstado
}

function badgeClass(estado?: string) {
  if (estado === 'ABIERTA') return 'badge-red'
  if (estado === 'EN_PROCESO') return 'badge-yellow'
  return 'badge-green'
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
.table-card { background: #111318; border: 1px solid #1a1d21; border-radius: 12px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; color: #888; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #1a1d21; }
.table td { padding: 12px 16px; font-size: 0.875rem; color: #ccc; border-bottom: 1px solid #1a1d21; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #16181c; }
.td-title { color: #fff; font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-casa { color: #888; font-size: 0.8rem; }
.td-date { color: #888; font-size: 0.8rem; white-space: nowrap; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 0.9rem; padding: 4px; border-radius: 4px; }
.btn-icon:hover { background: #1a1d21; }
.type-badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.type-badge.reclamo { background: rgba(255,59,48,0.15); color: #ff4444; }
.type-badge.solicitud { background: rgba(0,117,222,0.15); color: #0075de; }
.type-badge.idea { background: rgba(0,200,83,0.15); color: #00c853; }
.estado-select { background: #0a0c0f; border: 1px solid #1a1d21; border-radius: 6px; padding: 4px 8px; color: #fff; font-size: 0.75rem; cursor: pointer; }
.estado-select.abierta { border-color: rgba(255,59,48,0.5); }
.estado-select.en_proceso { border-color: rgba(255,180,0,0.5); }
.estado-select.cerrada { border-color: rgba(0,200,83,0.5); }
.badge { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.badge-red { background: rgba(255, 59, 48, 0.15); color: #ff4444; }
.badge-yellow { background: rgba(255, 180, 0, 0.15); color: #ffb400; }
.badge-green { background: rgba(0, 200, 83, 0.15); color: #00c853; }
.empty { padding: 40px; text-align: center; color: #888; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
.modal { background: #111318; border: 1px solid #1a1d21; border-radius: 16px; width: 520px; max-width: 95vw; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #1a1d21; }
.modal-header h3 { font-size: 1rem; font-weight: 600; color: #fff; }
.btn-close { background: none; border: none; color: #888; cursor: pointer; font-size: 1rem; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.detalle-row { display: flex; flex-direction: column; gap: 4px; }
.detalle-label { font-size: 0.75rem; color: #888; font-weight: 500; text-transform: uppercase; }
.detalle-value { font-size: 0.875rem; color: #fff; }
.detalle-desc { display: flex; flex-direction: column; gap: 8px; }
.desc-text { color: #ccc; font-size: 0.875rem; line-height: 1.6; background: #0a0c0f; padding: 12px; border-radius: 8px; margin: 0; }

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
