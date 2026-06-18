import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const published = query.published !== 'false'
  
  const skip = (page - 1) * limit
  
  const [noticias, total] = await Promise.all([
    prisma.noticia.findMany({
      where: { published },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.noticia.count({ where: { published } })
  ])
  
  return {
    noticias,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})
