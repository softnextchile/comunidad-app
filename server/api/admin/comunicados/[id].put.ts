import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// PUT /api/admin/comunicados/:id
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody(event)
  const { titulo, resumen, contenido, imagenUrl, publicado, esPinned } = body

  const item = await prisma.comunicado.update({
    where: { id },
    data: {
      ...(titulo !== undefined && { titulo }),
      ...(resumen !== undefined && { resumen }),
      ...(contenido !== undefined && { contenido }),
      ...(imagenUrl !== undefined && { imagenUrl }),
      ...(publicado !== undefined && { publicado }),
      ...(esPinned !== undefined && { esPinned }),
    },
  })

  return item
})
