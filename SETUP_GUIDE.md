# 🚀 Supabase Setup - Schritt für Schritt

## Übersicht
Supabase ist eine kostenlose PostgreSQL-Datenbank mit API. Perfekt für unseren Kalender!

---

## Schritt 1: Supabase Account erstellen

### 1.1 Account anlegen
1. Öffne: **https://supabase.com**
2. Klicke auf: **"Start your project"** (oben rechts)
3. Wähle: **"Sign in with GitHub"**
4. Autorisiere Supabase mit deinem GitHub Account

### 1.2 Organisation erstellen (falls gefragt)
- Wähle einen Namen für deine Organisation (z.B. dein GitHub Username)
- Free Plan auswählen (bleibt kostenlos!)

---

## Schritt 2: Neues Projekt erstellen

### 2.1 Projekt-Details
1. Klicke auf: **"New Project"**
2. Fülle aus:
   - **Name**: `vibedezember` (oder beliebiger Name)
   - **Database Password**: Wähle ein sicheres Passwort
     - ⚠️ **WICHTIG**: Speichere dieses Passwort irgendwo (z.B. Textdatei)
     - Du brauchst es später nicht mehr, aber gut zur Sicherheit
   - **Region**: Wähle `Europe West (Ireland)` oder nächste zu dir
   - **Pricing Plan**: Free ($0/month) ✅

3. Klicke auf: **"Create new project"**

⏰ **Warte 1-2 Minuten** während das Projekt erstellt wird...

---

## Schritt 3: Datenbank-Tabelle erstellen

### 3.1 SQL Editor öffnen
1. In der linken Sidebar: Klicke auf **SQL Editor** (Icon: </> )
2. Klicke auf: **"New query"**

### 3.2 SQL-Code einfügen und ausführen

Kopiere **diesen gesamten Code** und füge ihn in den SQL Editor ein:

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

-- Policy: Jeder kann Events bearbeiten
CREATE POLICY "Jeder kann Events bearbeiten"
  ON events FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Jeder kann Events löschen
CREATE POLICY "Jeder kann Events löschen"
  ON events FOR DELETE
  USING (true);
```

3. Klicke auf: **"Run"** (unten rechts) oder drücke `Ctrl+Enter`

✅ Du solltest sehen: **"Success. No rows returned"**

---

## Schritt 4: API-Credentials holen

### 4.1 Settings öffnen
1. Unten links: Klicke auf das **⚙️ Zahnrad-Icon** ("Project Settings")
2. In der Sidebar: Klicke auf **"API"**

### 4.2 Credentials kopieren

Du brauchst **2 Werte**:

#### A) Project URL
- Steht unter: **"Project URL"**
- Sieht aus wie: `https://abcdefghijk.supabase.co`
- **→ Kopiere diese URL**

#### B) API Key (anon, public)
- Steht unter: **"Project API keys"**
- Suche die Zeile mit: **"anon" "public"**
- Der Key ist **sehr lang** (ca. 150 Zeichen)
- **→ Klicke auf das Kopier-Icon** neben dem Key

---

## Schritt 5: Credentials in dein Projekt einfügen

### 5.1 Datei öffnen
Öffne die Datei `.env.local` in deinem Projekt

### 5.2 Credentials eintragen
Ersetze die Dummy-Werte mit deinen echten Werten:

```env
NEXT_PUBLIC_SUPABASE_URL=https://deine-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-sehr-langer-anon-key-hier
```

**Beispiel:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xkbqpzmxfhqrltscpvwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

### 5.3 Datei speichern
- Speichere `.env.local`
- ⚠️ **Committe diese Datei NICHT** (sie ist in .gitignore)

---

## Schritt 6: Testen

### 6.1 Development Server starten
```bash
npm run dev
```

### 6.2 Browser öffnen
- Öffne: `http://localhost:3000`
- Teste einen Termin zu erstellen
- Prüfe, ob der Termin gespeichert wird

### 6.3 Überprüfung in Supabase
1. Zurück zu Supabase Dashboard
2. Klicke links auf: **"Table Editor"**
3. Wähle die Tabelle: **"events"**
4. Du solltest deine eingetragenen Termine sehen! ✅

---

## Schritt 7: Für Vercel Deployment

### 7.1 Vercel Environment Variables
Wenn du auf Vercel deployest:

1. Gehe zu: **https://vercel.com/dashboard**
2. Wähle dein Projekt
3. Klicke auf: **"Settings"**
4. Klicke auf: **"Environment Variables"**
5. Füge hinzu:

**Variable 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `deine-project-url`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `dein-anon-key`
- Environments: ✅ Production, ✅ Preview, ✅ Development

6. Klicke: **"Save"**
7. **Redeploy**: Vercel → Deployments → ... (3 Punkte) → "Redeploy"

---

## ✅ Fertig!

Deine App nutzt jetzt eine gemeinsame Datenbank!

**Test:**
- Öffne die App in 2 verschiedenen Browsern/Tabs
- Erstelle einen Termin in Tab 1
- Aktualisiere Tab 2 → Termin sollte sichtbar sein! 🎉

---

## 🆘 Probleme?

### Fehler: "Invalid API key"
- Prüfe, ob du den **anon public** Key kopiert hast (nicht service_role)
- Prüfe, ob die URL korrekt ist (https://...)

### Fehler: "Relation does not exist"
- Gehe zurück zu Schritt 3 und führe das SQL nochmal aus

### Termine werden nicht gespeichert
- Prüfe `.env.local` - sind die Werte korrekt eingetragen?
- Restart den Dev Server: `Ctrl+C` dann `npm run dev`

### Sicherheit
- Die `anon public` Key ist sicher für Frontend-Nutzung
- Row Level Security (RLS) schützt die Daten
- Niemand kann die Datenbank direkt manipulieren

---

## 💡 Nützliche Links

- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Deine Projekt-Einstellungen**: https://app.supabase.com/project/_/settings/api

---

Viel Erfolg! 🚀
