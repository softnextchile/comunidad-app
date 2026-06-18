import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10
  const page = parseInt(query.page as string) || 1
  const skip = (page - 1) * limit

  const [comunicados, total] = await Promise.all([
    prisma.comunicado.findMany({
      where: { publicado: true },
      orderBy: [
        { esPinned: 'desc' },
        { fechaPublicacion: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.comunicado.count({ where: { publicado: true } }),
  ])

  return {
    comunicados,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  }
})
