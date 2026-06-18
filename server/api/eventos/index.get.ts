import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const upcoming = query.upcoming === 'true'

  const where = upcoming
    ? { publicado: true, fecha: { gte: new Date() } }
    : { publicado: true }

  const eventos = await prisma.evento.findMany({
    where,
    orderBy: { fecha: 'asc' },
    take: 20,
  })

  return { eventos }
})
