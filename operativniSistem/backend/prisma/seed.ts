import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.ts'
import { ListingKind, PropertyType } from '../generated/prisma/enums.ts'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('Manjka DATABASE_URL v datoteki .env.')

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const properties = [
  { slug: 'svetlo-stanovanje-v-siski', title: 'Svetlo stanovanje v Šiški', location: 'Ljubljana, Šiška', region: 'Ljubljana', price: 289000, area: 68, rooms: 3, year: 2018, type: PropertyType.APARTMENT, listingKind: ListingKind.SALE, description: 'Sodobno in svetlo trisobno stanovanje z veliko teraso, dvigalom in lastnim parkirnim mestom. Mirna lokacija z odlično povezavo do središča mesta.', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85', featured: true },
  { slug: 'druzinska-hisa-pod-pohorjem', title: 'Družinska hiša pod Pohorjem', location: 'Maribor, Radvanje', region: 'Podravska', price: 385000, area: 184, rooms: 5, year: 2012, type: PropertyType.HOUSE, listingKind: ListingKind.SALE, description: 'Prostorna družinska hiša z urejenim vrtom, garažo za dva avtomobila in odprtim pogledom proti Pohorju.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85', featured: true },
  { slug: 'apartma-s-pogledom-na-morje', title: 'Apartma s pogledom na morje', location: 'Piran, Punta', region: 'Obalno-kraška', price: 1250, area: 52, rooms: 2, year: 2006, type: PropertyType.APARTMENT, listingKind: ListingKind.RENT, description: 'Popolnoma opremljen apartma v starem mestnem jedru, le nekaj korakov od morja. Na voljo za dolgoročni najem.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85', featured: false },
  { slug: 'leseni-vikend-ob-jezeru', title: 'Leseni vikend ob jezeru', location: 'Bohinj, Ribčev Laz', region: 'Gorenjska', price: 248000, area: 76, rooms: 3, year: 1998, type: PropertyType.COTTAGE, listingKind: ListingKind.SALE, description: 'Prijeten lesen vikend na robu gozda z razgledom na gore. Jezero je oddaljeno deset minut hoje.', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85', featured: false },
  { slug: 'prenovljena-mescanska-garsonjera', title: 'Prenovljena meščanska garsonjera', location: 'Celje, Center', region: 'Savinjska', price: 590, area: 34, rooms: 1, year: 1974, type: PropertyType.APARTMENT, listingKind: ListingKind.RENT, description: 'Elegantno prenovljena garsonjera v neposredni bližini mestnega jedra. Stroški so nizki, vselitev je možna takoj.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85', featured: false },
  { slug: 'moderna-pisarna-ob-obvoznici', title: 'Moderna pisarna ob obvoznici', location: 'Ljubljana, Rudnik', region: 'Ljubljana', price: 2100, area: 126, rooms: 4, year: 2021, type: PropertyType.BUSINESS, listingKind: ListingKind.RENT, description: 'Svetel poslovni prostor z recepcijo, tremi pisarnami in sejno sobo. V ceno so vključena štiri parkirna mesta.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85', featured: false },
]

async function main() {
  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: property,
      create: property,
    })
  }
  console.log(`Seed uspešen: ${properties.length} nepremičnin.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

