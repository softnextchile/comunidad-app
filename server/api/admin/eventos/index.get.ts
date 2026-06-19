import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/eventos
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [items, total] = await Promise.all([
    prisma.evento.findMany({ orderBy: { fecha: 'asc' } }),
    prisma.evento.count(),
  ])

  return { items, total }
})
