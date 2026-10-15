import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.ts'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Manjka DATABASE_URL. Prekopiraj .env.example v .env in dodaj Supabase povezavo.')
}

const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// V razvoju ponovno uporabimo isti client in se izognemo dodatnim povezavam ob hot reloadu.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

