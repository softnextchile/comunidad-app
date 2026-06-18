interface Seccion {
  id: number
  clave: string
  titulo: string
  subtitulo?: string
  contenido: string
  imagenUrl?: string
  esActivo: boolean
  orden: number
}

export const useSecciones = () => {
  const secciones = useState<Seccion[]>('secciones', () => [])
  
  const fetchSecciones = async () => {
    try {
      const data = await $fetch<Seccion[]>('/api/secciones')
      secciones.value = data
    } catch (error) {
      console.error('Error fetching secciones:', error)
    }
  }
  
  const getSeccion = (clave: string) => {
    return computed(() => secciones.value.find(s => s.clave === clave))
  }
  
  const updateSeccion = async (id: number, data: Partial<Seccion>) => {
    const response = await $fetch<Seccion>(`/api/secciones/${id}`, {
      method: 'PUT',
      body: data
    })
    
    const index = secciones.value.findIndex(s => s.id === id)
    if (index !== -1) {
      secciones.value[index] = response
    }
    
    return response
  }
  
  const createSeccion = async (data: Partial<Seccion>) => {
    const response = await $fetch<Seccion>('/api/secciones', {
      method: 'POST',
      body: data
    })
    secciones.value.push(response)
    return response
  }
  
  return {
    secciones: readonly(secciones),
    fetchSecciones,
    getSeccion,
    updateSeccion,
    createSeccion
  }
}
