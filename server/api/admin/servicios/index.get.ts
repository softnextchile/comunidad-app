import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/servicios
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({ orderBy: { orden: 'asc' } }),
    prisma.servicio.count(),
  ])

  return { items, total }
})
