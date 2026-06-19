import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// GET /api/admin/vecinos
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: { rol: 'USUARIO' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        email: true,
        numeroCasa: true,
        emailValidado: true,
        createdAt: true,
        _count: { select: { solicitudes: true } },
      },
    }),
    prisma.user.count({ where: { rol: 'USUARIO' } }),
  ])

  return { items, total }
})
