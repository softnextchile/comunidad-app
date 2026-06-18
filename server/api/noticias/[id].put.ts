import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const id = parseInt(getRouterParam(event, 'id') || '')
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }
  
  const body = await readBody(event)
  const { titulo, resumen, contenido, imagenUrl, published, autor } = body
  
  const noticia = await prisma.noticia.update({
    where: { id },
    data: {
      titulo,
      resumen,
      contenido,
      imagenUrl,
      published,
      autor
    }
  })
  
  return noticia
})
