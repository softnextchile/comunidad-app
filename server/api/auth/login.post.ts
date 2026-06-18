import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { createToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password } = body
  
  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email y contraseña son requeridos' })
  }
  
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })
  }

  if (!user.emailValidado) {
    throw createError({ statusCode: 403, message: 'Confirma tu email antes de hacer login. Revisa tu bandeja de entrada.' })
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })
  }
  
  const token = createToken({
    userId: user.id,
    email: user.email,
    rol: user.rol
  })
  
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 días
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
