import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  
  const id = parseInt(getRouterParam(event, 'id') || '')
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }
  
  await prisma.contacto.update({
    where: { id },
    data: { leido: true }
  })
  
  return { success: true }
})
