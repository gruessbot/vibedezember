#!/usr/bin/env node

/**
 * Test-Script für Supabase-Verbindung
 * Führe aus mit: node scripts/test-supabase.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Teste Supabase-Verbindung...\n');

// Prüfe Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase Credentials nicht gefunden!\n');
  console.log('Bitte stelle sicher, dass .env.local existiert und folgende Variablen enthält:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
  console.log('Siehe SETUP_GUIDE.md für Details.\n');
  process.exit(1);
}

console.log('✅ Environment Variables gefunden');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

// Erstelle Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test 1: Verbindung testen
async function testConnection() {
  try {
    console.log('📡 Test 1: Teste Verbindung zur Datenbank...');

    const { data, error } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "public.events" does not exist')) {
        console.log('❌ Tabelle "events" existiert nicht!');
        console.log('   → Gehe zu Supabase SQL Editor und führe das CREATE TABLE Script aus');
        console.log('   → Siehe SETUP_GUIDE.md Schritt 3\n');
        return false;
      }
      throw error;
    }

    console.log('✅ Verbindung erfolgreich!\n');
    return true;
  } catch (error) {
    console.error('❌ Verbindungsfehler:', error.message);
    console.log('\nMögliche Ursachen:');
    console.log('  - Falsche URL oder API Key');
    console.log('  - Projekt noch nicht fertig erstellt (warte 1-2 Minuten)');
    console.log('  - Netzwerk-Problem\n');
    return false;
  }
}

// Test 2: Daten abrufen
async function testRead() {
  try {
    console.log('📖 Test 2: Teste Daten-Abruf...');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .limit(5);

    if (error) throw error;

    console.log(`✅ ${data.length} Termine in der Datenbank gefunden`);

    if (data.length > 0) {
      console.log('\n   Beispiel-Termin:');
      console.log(`   - Titel: ${data[0].title}`);
      console.log(`   - Datum: ${data[0].date} um ${data[0].time} Uhr`);
      console.log(`   - Von: ${data[0].created_by}`);
    } else {
      console.log('   (Noch keine Termine vorhanden - das ist OK!)');
    }
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Daten-Abruf:', error.message, '\n');
    return false;
  }
}

// Test 3: Schreiben testen
async function testWrite() {
  try {
    console.log('✍️  Test 3: Teste Daten-Schreibrechte...');

    const testEvent = {
      id: 'test-' + Date.now(),
      title: 'Test-Termin (wird gleich gelöscht)',
      description: 'Automatischer Test',
      date: '2099-12-31',
      time: '23:59',
      created_by: 'Test-Script',
      created_at: new Date().toISOString(),
    };

    // Schreiben
    const { data: writeData, error: writeError } = await supabase
      .from('events')
      .insert([testEvent])
      .select()
      .single();

    if (writeError) {
      throw new Error(`Schreiben fehlgeschlagen: ${writeError.message}`);
    }

    console.log('✅ Termin erfolgreich erstellt');

    // Wieder löschen
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', testEvent.id);

    if (deleteError) {
      console.log('⚠️  Warnung: Test-Termin konnte nicht gelöscht werden');
      console.log('   (Nicht schlimm, du kannst ihn manuell löschen)');
    } else {
      console.log('✅ Test-Termin erfolgreich gelöscht');
    }

    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Schreiben:', error.message);
    console.log('\nMögliche Ursachen:');
    console.log('  - RLS Policies nicht korrekt eingerichtet');
    console.log('  - Siehe SETUP_GUIDE.md Schritt 3\n');
    return false;
  }
}

// Alle Tests ausführen
async function runAllTests() {
  console.log('═══════════════════════════════════════════\n');

  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('═══════════════════════════════════════════\n');
    console.log('❌ Tests abgebrochen - Verbindung fehlgeschlagen\n');
    process.exit(1);
  }

  const readOk = await testRead();
  const writeOk = await testWrite();

  console.log('═══════════════════════════════════════════\n');

  if (connectionOk && readOk && writeOk) {
    console.log('✅ 🎉 ALLE TESTS BESTANDEN!\n');
    console.log('Deine Supabase-Datenbank ist einsatzbereit!');
    console.log('Starte die App mit: npm run dev\n');
    process.exit(0);
  } else {
    console.log('❌ Einige Tests sind fehlgeschlagen\n');
    console.log('Siehe Fehlermeldungen oben und SETUP_GUIDE.md\n');
    process.exit(1);
  }
}

// Start
runAllTests();
