import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// POST /api/admin/eventos
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { titulo, descripcion, fecha, hora, lugar, categoria, capMax, publicado } = body

  if (!titulo || !descripcion || !fecha) {
    throw createError({ statusCode: 400, message: 'titulo, descripcion y fecha son requeridos' })
  }

  const item = await prisma.evento.create({
    data: {
      titulo,
      descripcion,
      fecha: new Date(fecha),
      hora: hora || null,
      lugar: lugar || null,
      categoria: categoria || 'REUNION',
      capMax: capMax ? Number(capMax) : null,
      publicado: publicado ?? false,
    },
  })

  return item
})
