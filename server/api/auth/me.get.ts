import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, nombre: true, rol: true }
  })
  
  if (!user) {
    throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
  }
  
  return { user }
})
