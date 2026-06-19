import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/eventos
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.evento.findMany({
      skip,
      take: limit,
      orderBy: { fecha: 'asc' },
    }),
    prisma.evento.count(),
  ])

  return { items, total, page, limit }
})
