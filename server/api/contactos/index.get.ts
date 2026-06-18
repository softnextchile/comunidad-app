import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const contactos = await prisma.contacto.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return contactos
})
