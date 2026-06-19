import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// PUT /api/admin/eventos/:id
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody(event)
  const { titulo, descripcion, fecha, hora, lugar, categoria, capMax, publicado } = body

  const item = await prisma.evento.update({
    where: { id },
    data: {
      ...(titulo !== undefined && { titulo }),
      ...(descripcion !== undefined && { descripcion }),
      ...(fecha !== undefined && { fecha: new Date(fecha) }),
      ...(hora !== undefined && { hora }),
      ...(lugar !== undefined && { lugar }),
      ...(categoria !== undefined && { categoria }),
      ...(capMax !== undefined && { capMax: capMax ? Number(capMax) : null }),
      ...(publicado !== undefined && { publicado }),
    },
  })

  return item
})
