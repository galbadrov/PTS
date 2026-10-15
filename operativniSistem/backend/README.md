# Domio backend – Prisma + Supabase

## 1. Povezavi do baze

V Supabase projektu odpri **Connect** in kopiraj:

- **Transaction pooler** (port `6543`) v `DATABASE_URL`; na konec dodaj `?pgbouncer=true&sslmode=require`.
- **Direct connection** (port `5432`) v `DIRECT_URL`. Če direct povezava zaradi IPv6 ne deluje, uporabi **Session pooler** na portu `5432`.

Kopiraj `.env.example` v `.env` in zamenjaj vzorčne vrednosti. Geslo v URL-ju mora biti URL-kodirano, če vsebuje posebne znake.

## 2. Priprava sheme in testnih podatkov

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run db:check
```

`prisma:push` ustvari enum tipe in tabelo `properties`. `prisma:seed` varno doda ali posodobi šest začetnih nepremičnin glede na enolični `slug`.

## Uporabni ukazi

```bash
npm run prisma:studio     # grafični pregled podatkov
npm run prisma:migrate    # razvoj nove migracije
npm run prisma:deploy     # uporaba že izdelanih migracij
npm run build             # generiranje clienta in TypeScript pregled
npm start                 # testno prebere nepremičnine
```

Runtime Prisma Client je v `utils/prisma.ts`. Prisma uporablja `DATABASE_URL`; CLI ukazi iz `prisma.config.ts` uporabljajo `DIRECT_URL`.
