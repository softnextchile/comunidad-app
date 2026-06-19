/**
 * Composable para subir imágenes a Cloudinary con optimización.
 * Uso: const { upload, uploading, error } = useUpload()
 */
export function useUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function upload(file: File): Promise<{ url: string; publicId: string } | null> {
    uploading.value = true
    error.value = null

    try {
      const form = new FormData()
      form.append('file', file)

      const data = await $fetch<{ url: string; publicId: string }>('/api/upload', {
        method: 'POST',
        body: form,
      })

      return data
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Error al subir imagen'
      return null
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading, error }
}
