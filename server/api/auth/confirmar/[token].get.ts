import { prisma } from '~/server/utils/prisma'
import { sendEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, message: 'Token requerido' })
  }

  const user = await prisma.user.findFirst({
    where: {
      tokenConfirmacion: token,
      emailValidado: false,
    },
  })

  if (!user) {
    throw createError({ statusCode: 400, message: 'Token inválido o expirado' })
  }

  if (user.tokenExpira && new Date() > user.tokenExpira) {
    throw createError({ statusCode: 400, message: 'El token ha expirado. Solicita uno nuevo.' })
  }

  // Validar email y limpiar token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailValidado: true,
      tokenConfirmacion: null,
      tokenExpira: null,
    },
  })

  // Enviar mail de bienvenida
  try {
    await sendEmail({
      to: user.email,
      subject: 'Bienvenido a Villa Arrayán - Tu cuenta esta activa',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Cuenta activada</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hola <strong>${user.nombre}</strong>, tu cuenta ha sido confirmada exitosamente.
          </p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Ya puedes hacer login en la plataforma de la Junta de Vecinos Villa Arrayán y acceder a:
          </p>
          <ul style="color: #555; font-size: 15px; line-height: 1.8; padding-left: 20px;">
            <li>Comunicados oficiales de la junta</li>
            <li>Calendario de eventos vecinales</li>
            <li>Directorio de servicios útiles</li>
            <li>Formulario de contacto y solicitudes</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" style="display: inline-block; background: #0075de; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Ir a la plataforma
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Atentamente,<br/>Directorio Junta de Vecinos Villa Arrayán
          </p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Error enviando email de bienvenida:', emailError)
  }

  return {
    success: true,
    message: 'Email confirmado. Te enviamos un correo de bienvenida.',
  }
})
