import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Alle Termine abrufen
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Neuen Termin erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, time, createdBy } = body;

    if (!title || !date || !time || !createdBy) {
      return NextResponse.json(
        { error: 'Titel, Datum, Uhrzeit und Name sind erforderlich' },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Date.now().toString(),
      title,
      description: description || '',
      date,
      time,
      created_by: createdBy,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Termins' },
      { status: 500 }
    );
  }
}

// DELETE - Termin löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const createdBy = searchParams.get('createdBy');

    if (!id || !createdBy) {
      return NextResponse.json(
        { error: 'ID und Name sind erforderlich' },
        { status: 400 }
      );
    }

    // Prüfe ob der Event existiert und der Nutzer berechtigt ist
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (!event) {
      return NextResponse.json(
        { error: 'Termin nicht gefunden' },
        { status: 404 }
      );
    }

    if (event.created_by !== createdBy) {
      return NextResponse.json(
        { error: 'Du kannst nur deine eigenen Termine löschen' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Termins' },
      { status: 500 }
    );
  }
}

// PATCH - Termin bearbeiten
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, date, time, createdBy } = body;

    if (!id || !createdBy) {
      return NextResponse.json(
        { error: 'ID und Name sind erforderlich' },
        { status: 400 }
      );
    }

    // Prüfe ob der Event existiert und der Nutzer berechtigt ist
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (!event) {
      return NextResponse.json(
        { error: 'Termin nicht gefunden' },
        { status: 404 }
      );
    }

    if (event.created_by !== createdBy) {
      return NextResponse.json(
        { error: 'Du kannst nur deine eigenen Termine bearbeiten' },
        { status: 403 }
      );
    }

    // Termin aktualisieren
    const updates: any = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date) updates.date = date;
    if (time) updates.time = time;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Fehler beim Bearbeiten des Termins' },
      { status: 500 }
    );
  }
}
