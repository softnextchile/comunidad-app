import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { createToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password, nombre } = body
  
  if (!email || !password || !nombre) {
    throw createError({ statusCode: 400, message: 'Todos los campos son requeridos' })
  }
  
  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'La contraseña debe tener al menos 6 caracteres' })
  }
  
  const existing = await prisma.user.findUnique({ where: { email } })
  
  if (existing) {
    throw createError({ statusCode: 400, message: 'El email ya está registrado' })
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      rol: 'USUARIO'
    }
  })
  
  const token = createToken({
    userId: user.id,
    email: user.email,
    rol: user.rol
  })
  
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    }
  }
})
