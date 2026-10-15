import { prisma } from './utils/prisma.ts'

async function main() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Domio backend: naloženih ${properties.length} nepremičnin.`)
}

main()
  .catch((error) => {
    console.error('Napaka pri povezavi z bazo:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
