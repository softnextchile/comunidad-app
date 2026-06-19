import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// DELETE /api/admin/comunicados/:id
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  await prisma.comunicado.delete({ where: { id } })

  return { success: true }
})
