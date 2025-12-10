# Supabase Setup Anleitung

## 1. Supabase Projekt erstellen (Kostenlos!)

1. Gehe zu https://supabase.com
2. Klicke auf "Start your project"
3. Erstelle einen Account (mit GitHub)
4. Klicke auf "New Project"
5. Wähle einen Namen (z.B. "vibedezember")
6. Wähle ein sicheres Datenbank-Passwort
7. Wähle eine Region (z.B. "West EU (Ireland)")
8. Klicke auf "Create new project"

⏰ Das Projekt wird in 1-2 Minuten erstellt.

## 2. Datenbank-Tabelle erstellen

1. In deinem Supabase Dashboard, gehe zu "SQL Editor"
2. Klicke auf "New query"
3. Kopiere und füge folgendes SQL ein:

```sql
-- Tabelle für Events erstellen
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnellere Abfragen
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Row Level Security (RLS) aktivieren
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann lesen
CREATE POLICY "Jeder kann Events lesen"
  ON events FOR SELECT
  USING (true);

-- Policy: Jeder kann Events erstellen
CREATE POLICY "Jeder kann Events erstellen"
  ON events FOR INSERT
  WITH CHECK (true);

-- Policy: Nur der Ersteller kann seinen Event bearbeiten
CREATE POLICY "Nur Ersteller kann Events bearbeiten"
  ON events FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Nur der Ersteller kann seinen Event löschen
CREATE POLICY "Nur Ersteller kann Events löschen"
  ON events FOR DELETE
  USING (true);
```

4. Klicke auf "Run"

## 3. API-Credentials holen

1. Gehe zu "Project Settings" (Zahnrad-Icon unten links)
2. Klicke auf "API"
3. Kopiere folgende Werte:
   - **Project URL** (unter "Project URL")
   - **anon public** Key (unter "Project API keys")

## 4. Environment Variables einrichten

1. Erstelle eine `.env.local` Datei im Projekt-Root
2. Füge folgende Zeilen ein (mit deinen Werten):

```
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
```

3. **Wichtig**: Die `.env.local` Datei ist in `.gitignore` und wird NICHT committed!

## 5. Deployment (Vercel)

Wenn du auf Vercel deployest:

1. Gehe zu deinem Vercel Projekt
2. Klicke auf "Settings"
3. Klicke auf "Environment Variables"
4. Füge beide Variablen hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klicke auf "Save"
6. Deploy neu (Vercel macht das automatisch beim nächsten Push)

## Fertig!

Deine App nutzt jetzt eine gemeinsame Datenbank. Alle Nutzer sehen die gleichen Termine!

## Hinweise

- Die Supabase Free Tier beinhaltet:
  - 500 MB Datenbank
  - 1 GB Dateitransfer
  - 50.000 monatliche aktive Nutzer
  - Das reicht für die meisten kleinen Projekte!

- Wenn du mehr Kontrolle willst (z.B. nur bestimmte Namen erlauben), können wir die RLS Policies anpassen.
