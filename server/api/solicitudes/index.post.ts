import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/jwt'

// POST /api/solicitudes (vecino logueado crea solicitud)
// No requiere admin, solo auth
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const body = await readBody(event)
  const { titulo, descripcion, tipo } = body

  if (!titulo || !descripcion) {
    throw createError({ statusCode: 400, message: 'titulo y descripcion son requeridos' })
  }

  const tiposValidos = ['RECLAMO', 'SOLICITUD', 'IDEA']
  const tipoFinal = tiposValidos.includes(tipo) ? tipo : 'SOLICITUD'

  const solicitud = await prisma.solicitud.create({
    data: {
      titulo,
      descripcion,
      tipo: tipoFinal,
      estado: 'ABIERTA',
      solicitanteId: user.userId,
    },
    include: {
      solicitante: { select: { id: true, nombre: true, email: true } },
    },
  })

  return solicitud
})
