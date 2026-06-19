import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/jwt'

// GET /api/solicitudes/mis (solicitudes del vecino logueado)
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const solicitudes = await prisma.solicitud.findMany({
    where: { solicitanteId: user.userId },
    orderBy: { createdAt: 'desc' },
  })

  return solicitudes
})
