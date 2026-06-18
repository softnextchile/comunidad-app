import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { nombre, email, telefono, mensaje } = body
  
  if (!nombre || !email || !mensaje) {
    throw createError({ statusCode: 400, message: 'Nombre, email y mensaje son requeridos' })
  }
  
  const contacto = await prisma.contacto.create({
    data: { nombre, email, telefono, mensaje }
  })
  
  return { success: true, id: contacto.id }
})
