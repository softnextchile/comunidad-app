import { optimizeImage, uploadToCloudinary } from '~/server/utils/cloudinary'

/**
 * POST /api/upload
 * Body: multipart/form-data con campo "file" (imagen)
 * Headers: Authorization: Bearer <token> (requiere admin)
 *
 * Optimiza la imagen (resize + WebP) y la sube a Cloudinary.
 * Retorna { url, publicId }
 */
export default defineEventHandler(async (event) => {
  const { requireAdmin } = await import('~/server/utils/jwt')
  await requireAdmin(event)

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No se envió ningún archivo' })
  }

  const file = formData.find((f) => f.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'Campo "file" no encontrado' })
  }

  const mimeType = file.type || 'image/jpeg'
  if (!mimeType.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'El archivo debe ser una imagen' })
  }

  // Determinar formato destino
  let format: 'webp' | 'jpeg' | 'png' = 'webp'
  if (mimeType === 'image/png') format = 'png'
  if (mimeType === 'image/gif') format = 'jpeg'

  // Optimizar
  const optimized = await optimizeImage(file.data, {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 80,
    format,
  })

  // Subir a Cloudinary
  const { url, publicId } = await uploadToCloudinary(optimized, 'villa-arrayan')

  return { url, publicId }
})
