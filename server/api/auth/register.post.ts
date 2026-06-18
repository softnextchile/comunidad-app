import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from '~/server/utils/prisma'
import { createToken } from '~/server/utils/jwt'
import { sendEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, nombre, numeroCasa } = body

  if (!email || !password || !nombre) {
    throw createError({ statusCode: 400, message: 'Todos los campos son requeridos' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'La contrasena debe tener al menos 6 caracteres' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    throw createError({ statusCode: 400, message: 'El email ya esta registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  // Generar token de confirmacion (valido 48 horas)
  const token = randomBytes(32).toString('hex')
  const tokenExpira = new Date(Date.now() + 48 * 60 * 60 * 1000)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      numeroCasa: numeroCasa || null,
      rol: 'USUARIO',
      emailValidado: false,
      tokenConfirmacion: token,
      tokenExpira,
    },
  })

  // Enviar email de confirmacion
  const baseUrl = process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const confirmUrl = `${baseUrl}/confirmar/${token}`

  try {
    await sendEmail({
      to: email,
      subject: 'Confirma tu email - Villa Arrayán',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Bienvenido a Villa Arrayán</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hola <strong>${nombre}</strong>, gracias por registrarte en la plataforma de la Junta de Vecinos Villa Arrayán.
          </p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Para activar tu cuenta, haz clic en el siguiente botón:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmUrl}" style="display: inline-block; background: #0075de; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Confirmar mi email
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br/>
            <a href="${confirmUrl}" style="color: #0075de;">${confirmUrl}</a>
          </p>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Este enlace expira en 48 horas. Si no solicitaste este registro, puedes ignorar este email.
          </p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Error enviando email de confirmacion:', emailError)
    // No fallamos el registro si el email falla
  }

  return {
    success: true,
    message: 'Registro exitoso. Te enviamos un email de confirmacion.',
  }
})
