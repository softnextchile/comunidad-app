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
          <NuxtLink to="/admin/secciones" class="admin-nav-item">
            📝 Secciones
          </NuxtLink>
          <NuxtLink to="/admin/noticias" class="admin-nav-item" :class="{ active: route.path === '/admin/noticias' }">
            📰 Noticias
          </NuxtLink>
          <NuxtLink to="/admin/contactos" class="admin-nav-item">
            ✉️ Contactos
          </NuxtLink>
        </nav>
      </aside>
      
      <main class="admin-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1>Gestionar Noticias</h1>
          <button @click="openModal()" class="btn btn-primary">
            + Nueva Noticia
          </button>
        </div>
        
        <div v-if="loading" class="text-center text-muted">
          Cargando...
        </div>
        
        <div v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="noticia in noticias" :key="noticia.id">
                <td>{{ noticia.titulo }}</td>
                <td>
                  <span :class="['badge', noticia.published ? 'badge-success' : 'badge-warning']">
                    {{ noticia.published ? 'Publicada' : 'Borrador' }}
                  </span>
                </td>
                <td>{{ formatDate(noticia.createdAt) }}</td>
                <td>
                  <button @click="editNoticia(noticia)" class="btn btn-secondary" style="padding: 4px 12px; margin-right: 8px;">
                    Editar
                  </button>
                  <button @click="deleteNoticia(noticia.id)" class="btn" style="padding: 4px 12px; background: #fee; color: #dc3545;">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Modal -->
        <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
          <div class="card" style="width: 700px; max-height: 90vh; overflow-y: auto;">
            <h3 style="margin-bottom: 24px;">{{ isEditing ? 'Editar' : 'Nueva' }} Noticia</h3>
            
            <form @submit.prevent="saveNoticia">
              <div class="form-group">
                <label class="form-label">Título *</label>
                <input v-model="form.titulo" type="text" class="form-input" required />
              </div>
              
              <div class="form-group">
                <label class="form-label">Resumen *</label>
                <textarea v-model="form.resumen" class="form-input" rows="2" required></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Contenido *</label>
                <textarea v-model="form.contenido" class="form-input" rows="8" required></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">URL de Imagen</label>
                <input v-model="form.imagenUrl" type="url" class="form-input" placeholder="https://..." />
              </div>
              
              <div class="form-group">
                <label class="form-label">Autor</label>
                <input v-model="form.autor" type="text" class="form-input" />
              </div>
              
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input v-model="form.published" type="checkbox" />
                  Publicar inmediatamente
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
  loadNoticias()
})

const noticias = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  titulo: '',
  resumen: '',
  contenido: '',
  imagenUrl: '',
  autor: '',
  published: false
})

const loadNoticias = async () => {
  try {
    const data = await $fetch<any>('/api/noticias?published=false&limit=100')
    noticias.value = data.noticias
  } catch (e) {
    console.error('Error loading:', e)
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  Object.assign(form, { titulo: '', resumen: '', contenido: '', imagenUrl: '', autor: '', published: false })
  isEditing.value = false
  editingId.value = null
  showModal.value = true
}

const editNoticia = (noticia: any) => {
  Object.assign(form, noticia)
  isEditing.value = true
  editingId.value = noticia.id
  showModal.value = true
}

const saveNoticia = async () => {
  saving.value = true
  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`/api/noticias/${editingId.value}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/noticias', { method: 'POST', body: form })
    }
    showModal.value = false
    loadNoticias()
  } catch (e: any) {
    alert(e.data?.message || 'Error al guardar')
  } finally {
    saving.value = false
  }
}

const deleteNoticia = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar esta noticia?')) return
  try {
    await $fetch(`/api/noticias/${id}`, { method: 'DELETE' })
    loadNoticias()
  } catch (e) {
    alert('Error al eliminar')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL')
}
</script>
