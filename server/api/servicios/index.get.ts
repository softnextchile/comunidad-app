import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const servicios = await prisma.servicio.findMany({
    where: { esActivo: true },
    orderBy: { orden: 'asc' },
  })

  return { servicios }
})
