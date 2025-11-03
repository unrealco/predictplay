# Predict Play (No-Auth, Local DB)

Gift-based, **no-cash** prediction app MVP. This build is configured for **local Postgres** and **no authentication** (all API endpoints open).

## Quickstart

```bash
npm install
cp .env.example .env
# Ensure your local Postgres is running and database exists:
# createdb predictplay   (mac/linux) OR create manually via GUI
npm run prisma:migrate
npm run dev
```

Visit http://localhost:3000

## Deploy
You can deploy to Vercel; make sure to set `DATABASE_URL` in project env vars and run migrations.
