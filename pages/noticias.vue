<template>
  <div>
    <AppNavbar />
    
    <section class="section" style="background: var(--color-warm-white); padding: 48px 0;">
      <div class="container">
        <h1 class="section-title">Noticias</h1>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div class="section-grid">
          <article v-for="noticia in noticias" :key="noticia.id" class="card news-card">
            <img 
              v-if="noticia.imagenUrl" 
              :src="noticia.imagenUrl" 
              :alt="noticia.titulo"
              class="news-card-image"
            />
            <div v-else class="news-card-image" style="background: var(--color-warm-white);"></div>
            <div class="news-card-content">
              <h3 class="news-card-title">{{ noticia.titulo }}</h3>
              <p class="news-card-excerpt">{{ noticia.resumen }}</p>
              <span class="news-card-date">{{ formatDate(noticia.createdAt) }}</span>
            </div>
          </article>
        </div>
        
        <div v-if="noticias.length === 0" class="text-center text-muted" style="padding: 64px 0;">
          <p>No hay noticias publicadas todavía.</p>
        </div>
        
        <div v-if="pagination.totalPages > 1" class="text-center mt-lg">
          <button 
            v-if="page > 1" 
            @click="page--" 
            class="btn btn-secondary"
          >
            ← Anterior
          </button>
          <span class="mx-md">
            Página {{ page }} de {{ pagination.totalPages }}
          </span>
          <button 
            v-if="page < pagination.totalPages" 
            @click="page++" 
            class="btn btn-secondary"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
    
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
const page = ref(1)

const { data, refresh } = await useFetch('/api/noticias', {
  query: { page, limit: 9 }
})

const noticias = computed(() => data.value?.noticias || [])
const pagination = computed(() => data.value?.pagination || { page: 1, totalPages: 1 })

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

watch(page, () => refresh())
</script>
