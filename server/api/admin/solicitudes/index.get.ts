import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/solicitudes
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.solicitud.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        solicitante: { select: { id: true, nombre: true, email: true, numeroCasa: true } },
      },
    }),
    prisma.solicitud.count(),
  ])

  return { items, total, page, limit }
})
