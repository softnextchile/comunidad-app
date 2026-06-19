import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// PUT /api/admin/servicios/:id
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody(event)
  const { nombre, telefono, email, descripcion, categoria, esActivo, orden } = body

  const item = await prisma.servicio.update({
    where: { id },
    data: {
      ...(nombre !== undefined && { nombre }),
      ...(telefono !== undefined && { telefono }),
      ...(email !== undefined && { email }),
      ...(descripcion !== undefined && { descripcion }),
      ...(categoria !== undefined && { categoria }),
      ...(esActivo !== undefined && { esActivo }),
      ...(orden !== undefined && { orden: Number(orden) }),
    },
  })

  return item
})
