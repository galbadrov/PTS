import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // CLI in migracije naj uporabljajo neposredno povezavo, ne transaction poolerja.
  datasource: {
    url: env('DIRECT_URL'),
  },
})

