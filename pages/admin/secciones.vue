<template>
  <div>
    <AppNavbar />
    
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 style="margin-bottom: 24px; font-size: 1.25rem;">Panel Admin</h2>
        <nav>
          <NuxtLink to="/admin" class="admin-nav-item">
            📊 Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/secciones" class="admin-nav-item" :class="{ active: route.path === '/admin/secciones' }">
            📝 Secciones
          </NuxtLink>
          <NuxtLink to="/admin/noticias" class="admin-nav-item">
            📰 Noticias
          </NuxtLink>
          <NuxtLink to="/admin/contactos" class="admin-nav-item">
            ✉️ Contactos
          </NuxtLink>
        </nav>
      </aside>
      
      <main class="admin-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1>Gestionar Secciones</h1>
        </div>
        
        <div v-if="loading" class="text-center text-muted">
          Cargando...
        </div>
        
        <div v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seccion in secciones" :key="seccion.id">
                <td><code>{{ seccion.clave }}</code></td>
                <td>{{ seccion.titulo }}</td>
                <td>
                  <span :class="['badge', seccion.esActivo ? 'badge-success' : 'badge-warning']">
                    {{ seccion.esActivo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button @click="editSeccion(seccion)" class="btn btn-secondary" style="padding: 4px 12px;">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Modal de edición -->
        <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
          <div class="card" style="width: 600px; max-height: 90vh; overflow-y: auto;">
            <h3 style="margin-bottom: 24px;">Editar Sección</h3>
            
            <form @submit.prevent="saveSeccion">
              <div class="form-group">
                <label class="form-label">Clave</label>
                <input v-model="editForm.clave" type="text" class="form-input" required />
              </div>
              
              <div class="form-group">
                <label class="form-label">Título</label>
                <input v-model="editForm.titulo" type="text" class="form-input" required />
              </div>
              
              <div class="form-group">
                <label class="form-label">Subtítulo</label>
                <input v-model="editForm.subtitulo" type="text" class="form-input" />
              </div>
              
              <div class="form-group">
                <label class="form-label">Contenido</label>
                <textarea v-model="editForm.contenido" class="form-input" rows="5"></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">URL de Imagen</label>
                <input v-model="editForm.imagenUrl" type="url" class="form-input" />
              </div>
              
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input v-model="editForm.esActivo" type="checkbox" />
                  Sección Activa
                </label>
              </div>
              
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" @click="showModal = false" class="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAdmin, isAuthenticated, fetchUser } = useAuth()

onMounted(async () => {
  await fetchUser()
  if (!isAuthenticated.value) {
    router.push('/login')
  } else if (!isAdmin.value) {
    router.push('/')
  }
  loadSecciones()
})

const secciones = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)

const editForm = reactive({
  id: 0,
  clave: '',
  titulo: '',
  subtitulo: '',
  contenido: '',
  imagenUrl: '',
  esActivo: true
})

const loadSecciones = async () => {
  try {
    const data = await $fetch<any[]>('/api/secciones')
    secciones.value = data
  } catch (e) {
    console.error('Error loading secciones:', e)
  } finally {
    loading.value = false
  }
}

const editSeccion = (seccion: any) => {
  Object.assign(editForm, seccion)
  showModal.value = true
}

const saveSeccion = async () => {
  saving.value = true
  try {
    await $fetch(`/api/secciones/${editForm.id}`, {
      method: 'PUT',
      body: editForm
    })
    showModal.value = false
    loadSecciones()
  } catch (e: any) {
    alert(e.data?.message || 'Error al guardar')
  } finally {
    saving.value = false
  }
}
</script>
