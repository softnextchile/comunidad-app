import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const id = parseInt(getRouterParam(event, 'id') || '')
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }
  
  const body = await readBody(event)
  
  const { clave, titulo, subtitulo, contenido, imagenUrl, esActivo, orden } = body
  
  const seccion = await prisma.seccion.update({
    where: { id },
    data: {
      clave,
      titulo,
      subtitulo,
      contenido,
      imagenUrl,
      esActivo,
      orden
    }
  })
  
  return seccion
})
