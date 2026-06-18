import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  const comunicado = await prisma.comunicado.findUnique({
    where: { id },
  })

  if (!comunicado || !comunicado.publicado) {
    throw createError({ statusCode: 404, message: 'Comunicado no encontrado' })
  }

  return { comunicado }
})
