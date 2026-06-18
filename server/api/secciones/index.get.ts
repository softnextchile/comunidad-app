import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const secciones = await prisma.seccion.findMany({
    where: { esActivo: true },
    orderBy: { orden: 'asc' }
  })
  
  return secciones
})
