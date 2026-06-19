import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// POST /api/admin/comunicados
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { titulo, resumen, contenido, imagenUrl, publicado, esPinned, autorId } = body

  if (!titulo || !resumen || !contenido) {
    throw createError({ statusCode: 400, message: 'titulo, resumen y contenido son requeridos' })
  }

  const item = await prisma.comunicado.create({
    data: {
      titulo,
      resumen,
      contenido,
      imagenUrl: imagenUrl || null,
      publicado: publicado ?? false,
      esPinned: esPinned ?? false,
      autorId: autorId || null,
      fechaPublicacion: new Date(),
    },
  })

  return item
})
