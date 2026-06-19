import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// POST /api/admin/servicios
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { nombre, telefono, email, descripcion, categoria, esActivo, orden } = body

  if (!nombre || !telefono) {
    throw createError({ statusCode: 400, message: 'nombre y telefono son requeridos' })
  }

  const item = await prisma.servicio.create({
    data: {
      nombre,
      telefono,
      email: email || null,
      descripcion: descripcion || null,
      categoria: categoria || 'COMUN',
      esActivo: esActivo ?? true,
      orden: orden ? Number(orden) : 0,
    },
  })

  return item
})
