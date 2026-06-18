import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const body = await readBody(event)
  
  const { clave, titulo, subtitulo, contenido, imagenUrl, esActivo, orden } = body
  
  const seccion = await prisma.seccion.create({
    data: {
      clave,
      titulo,
      subtitulo,
      contenido,
      imagenUrl,
      esActivo: esActivo ?? true,
      orden: orden ?? 0
    }
  })
  
  return seccion
})
