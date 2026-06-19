import { v2 as cloudinary } from 'cloudinary'

const config = useRuntimeConfig()

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
})

export { cloudinary }

/**
 * Optimización de imagen antes de subir a Cloudinary.
 * Usa sharp (incluido en Node 20) para:
 *   1. Redimensionar si supera maxWidth/maxHeight
 *   2. Convertir a WebP (mejor compresión)
 *   3. Comprimir calidad
 * Retorna buffer optimizado listo para subir.
 */
export async function optimizeImage(
  buffer: Buffer,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): Promise<Buffer> {
  const { maxWidth = 1200, maxHeight = 800, quality = 80, format = 'webp' } = options

  // Dynamic import de sharp (builtin de node:20-slim)
  const sharp = (await import('sharp')).default

  let pipeline = sharp(buffer)

  // Redimensionar solo si es necesario
  const metadata = await pipeline.metadata()
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true })
  }
  if (metadata.height && metadata.height > maxHeight) {
    pipeline = pipeline.resize(null, maxHeight, { withoutEnlargement: true })
  }

  // Convertir y comprimir
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality })
      break
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, progressive: true })
      break
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 9 })
      break
  }

  return pipeline.toBuffer()
}

/**
 * Sube un buffer a Cloudinary y retorna la URL pública.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'villa-arrayan'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      )
      .end(buffer)
  })
}

/**
 * Elimina una imagen de Cloudinary por publicId.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
