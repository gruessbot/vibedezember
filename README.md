# 📅 Vibedezember - Gemeinsamer Terminkalender

Ein moderner, gemeinsamer Terminkalender, in dem jeder Termine eintragen kann und alle die gleichen Termine sehen.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

### 📋 Kalender
- **Monatsansicht** mit Navigation (vor/zurück)
- **Termine im Kalender** anklickbar für Details
- **Heutiges Datum** hervorgehoben
- **Klickbare Termine** zeigen Details-Modal

### ➕ Termine
- **Erstellen**: Name, Titel, Beschreibung, Datum, Uhrzeit
- **Bearbeiten**: Nur eigene Termine (Namensverifikation)
- **Löschen**: Nur eigene Termine (Namensverifikation)
- **Details-Modal**: Vollständige Anzeige beim Klicken

### 🔍 Filter
- Nach **Person** filtern (Dropdown)
- Nach **Datumsbereich** filtern (Von/Bis)
- Filter zurücksetzen

### 📤 Export
- **iCal Export** (.ics) - Import in Outlook, Google Calendar, etc.
- **CSV Export** - Öffnen in Excel, Google Sheets, etc.

### 🌐 Gemeinsame Datenbank
- Alle Nutzer sehen die **gleichen Termine**
- Echtzeit-Synchronisation via **Supabase**
- Funktioniert geräteübergreifend

## 🚀 Schnellstart

### 1. Installation

```bash
npm install
```

### 2. Supabase Setup

**Folge der detaillierten Anleitung:**

📖 **Siehe [SETUP_GUIDE.md](./SETUP_GUIDE.md)** für Schritt-für-Schritt Anleitung

**Kurzversion:**
1. Gehe zu https://supabase.com und erstelle ein Projekt
2. Führe das SQL-Script aus (siehe SETUP_GUIDE.md)
3. Kopiere URL und API Key
4. Erstelle `.env.local` mit deinen Credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### 3. Supabase-Verbindung testen

```bash
node scripts/test-supabase.js
```

Wenn alle Tests ✅ bestanden → weiter zu Schritt 4!

### 4. Development Server starten

```bash
npm run dev
```

Öffne http://localhost:3000 🎉

## 📦 Deployment

### Vercel (Empfohlen)

1. Pushe dein Repository zu GitHub
2. Gehe zu https://vercel.com
3. Importiere dein Repository
4. Füge Environment Variables hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy! 🚀

**Detaillierte Anleitung:** Siehe [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Technologie-Stack

- **Framework**: Next.js 16 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **Datenbank**: Supabase (PostgreSQL)
- **Deployment**: Vercel (empfohlen)

## 📁 Projekt-Struktur

```
vibedezember/
├── app/
│   ├── api/events/          # API Routes (GET, POST, PATCH, DELETE)
│   ├── page.tsx             # Hauptseite (Kalender)
│   └── layout.tsx           # Layout
├── lib/
│   └── supabase.ts          # Supabase Client
├── types/
│   └── event.ts             # TypeScript Types
├── data/
│   └── events.json          # (veraltet, jetzt Supabase)
├── scripts/
│   └── test-supabase.js     # Test-Script für Supabase
├── SETUP_GUIDE.md           # Supabase Setup-Anleitung
├── DEPLOYMENT.md            # Deployment-Anleitung
└── README.md                # Diese Datei
```

## 🔒 Sicherheit

- **Row Level Security (RLS)** aktiviert
- Jeder kann Termine lesen und erstellen
- Bearbeiten/Löschen nur mit Namensverifikation
- `anon public` Key ist sicher für Frontend

## 🐛 Fehlersuche

### Termine werden nicht gespeichert

**Lösung:**
1. Prüfe `.env.local` - sind die Credentials korrekt?
2. Führe `node scripts/test-supabase.js` aus
3. Restart Dev Server: `Ctrl+C` dann `npm run dev`

### Fehler: "relation does not exist"

**Lösung:**
- Gehe zu Supabase SQL Editor
- Führe das CREATE TABLE Script nochmal aus
- Siehe SETUP_GUIDE.md Schritt 3

### Test-Script Fehler

**Lösung:**
- Prüfe ob `.env.local` existiert
- Prüfe ob alle Variablen korrekt eingetragen sind
- Siehe SETUP_GUIDE.md

## 📚 Dokumentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Supabase Setup Schritt-für-Schritt
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Technische Details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment auf Vercel/Netlify/Railway

## 🤝 Beitragen

Dieses Projekt wurde mit Claude Code erstellt!

## 📝 Lizenz

MIT License - Nutze frei für deine Projekte!

## 🎯 Nächste Features (Optional)

Mögliche Erweiterungen:
- [ ] Authentifizierung (Supabase Auth)
- [ ] Kategorien/Tags für Termine
- [ ] Benachrichtigungen per Email
- [ ] Wiederkehrende Termine
- [ ] Kommentare zu Terminen
- [ ] Datei-Anhänge
- [ ] Mobile App (React Native)

---

Viel Spaß mit deinem Kalender! 🎉

Bei Fragen: Siehe [SETUP_GUIDE.md](./SETUP_GUIDE.md) oder prüfe die Supabase Docs.
