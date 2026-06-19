import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const config = useRuntimeConfig()

export interface JWTPayload {
  userId: number
  email: string
  rol: 'ADMIN' | 'USUARIO'
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromHeader(event: H3Event): string | null {
  // Try Authorization header first (client sends Bearer token)
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  // Fallback: read httpOnly cookie set by login
  return getCookie(event, 'auth_token') ?? null
}

export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = getTokenFromHeader(event)
  if (!token) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Token inválido' })
  }
  
  return payload
}

export async function requireAdmin(event: H3Event): Promise<JWTPayload> {
  const user = await requireAuth(event)
  if (user.rol !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }
  return user
}
