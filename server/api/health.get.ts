import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  let dbStatus = 'unknown'
  let dbError = null
  
  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch (e: any) {
    dbStatus = 'error'
    dbError = e.message
  }
  
  let tableCount = 0
  try {
    const result = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`
    tableCount = Number(result[0]?.count || 0)
  } catch (e: any) {
    dbError = (dbError || '') + ' | tables: ' + e.message
  }
  
  return {
    status: dbStatus,
    dbError,
    tableCount,
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DATABASE_URL_HOST: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'not set',
    }
  }
})
