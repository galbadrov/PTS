import { prisma } from '../utils/prisma.ts'

try {
  const count = await prisma.property.count()
  console.log(`Povezava s Supabase deluje. V tabeli properties je ${count} zapisov.`)
} finally {
  await prisma.$disconnect()
}

