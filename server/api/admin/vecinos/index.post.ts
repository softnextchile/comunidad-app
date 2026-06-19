import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/jwt'

// POST /api/admin/vecinos (crear vecino manualmente)
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { nombre, email, numeroCasa, password } = body

  if (!nombre || !email) {
    throw createError({ statusCode: 400, message: 'nombre y email son requeridos' })
  }

  // Verificar que no exista
  const existente = await prisma.user.findUnique({ where: { email } })
  if (existente) {
    throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese email' })
  }

  const passwordHash = await bcrypt.hash(password || 'vecino2024', 10)

  const user = await prisma.user.create({
    data: {
      nombre,
      email,
      numeroCasa: numeroCasa || null,
      password: passwordHash,
      rol: 'USUARIO',
      emailValidado: true, // Creado por admin, se da por validado
    },
    select: { id: true, nombre: true, email: true, numeroCasa: true, rol: true, emailValidado: true },
  })

  return user
})
