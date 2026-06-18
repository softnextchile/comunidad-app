import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const body = await readBody(event)
  const { titulo, resumen, contenido, imagenUrl, published, autor } = body
  
  const noticia = await prisma.noticia.create({
    data: {
      titulo,
      resumen,
      contenido,
      imagenUrl,
      published: published ?? false,
      autor
    }
  })
  
  return noticia
})
