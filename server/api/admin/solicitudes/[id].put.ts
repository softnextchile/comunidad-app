import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// PUT /api/admin/solicitudes/:id (cambiar estado)
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody(event)
  const { estado } = body

  const estadosValidos = ['ABIERTA', 'EN_PROCESO', 'CERRADA']
  if (!estadosValidos.includes(estado)) {
    throw createError({ statusCode: 400, message: 'Estado inválido' })
  }

  const item = await prisma.solicitud.update({
    where: { id },
    data: { estado },
    include: { solicitante: { select: { id: true, nombre: true, email: true } } },
  })

  return item
})
