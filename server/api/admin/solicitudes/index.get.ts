import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/solicitudes
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [items, total] = await Promise.all([
    prisma.solicitud.findMany({
      orderBy: { createdAt: 'desc' },
      include: { solicitante: { select: { id: true, nombre: true, email: true, numeroCasa: true } } },
    }),
    prisma.solicitud.count(),
  ])

  return { items, total }
})
