# Deployment Anleitung

## Option 1: Vercel (Empfohlen - Kostenlos)

### Mit GitHub:
1. Gehe zu https://vercel.com
2. Klicke auf "Sign Up" und verbinde deinen GitHub Account
3. Klicke auf "Add New Project"
4. Wähle dein Repository `vibedezember` aus
5. Klicke auf "Deploy"
6. Fertig! Nach 1-2 Minuten bekommst du eine URL wie: `https://vibedezember.vercel.app`

### Mit Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel
```

## Option 2: Netlify (Kostenlos)

1. Gehe zu https://netlify.com
2. Klicke auf "Add new site" → "Import an existing project"
3. Verbinde dein GitHub Repository
4. Build Command: `npm run build`
5. Publish Directory: `.next`
6. Klicke auf "Deploy"

## Option 3: Railway (Kostenlos)

1. Gehe zu https://railway.app
2. Klicke auf "Start a New Project"
3. Wähle "Deploy from GitHub repo"
4. Wähle dein Repository
5. Railway erkennt Next.js automatisch
6. Klicke auf "Deploy"

## Wichtig nach dem Deployment:

Die JSON-Datei (`data/events.json`) wird bei jedem Deployment zurückgesetzt. Für Production empfehle ich später eine richtige Datenbank (z.B. Supabase, PlanetScale, oder Railway PostgreSQL).

## Lokales Testen (falls du später Zugriff hast):

```bash
npm run dev
# Öffne http://localhost:3000
```
