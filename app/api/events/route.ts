import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Event } from '@/types/event';

const eventsFilePath = path.join(process.cwd(), 'data', 'events.json');

// GET - Alle Termine abrufen
export async function GET() {
  try {
    const fileContents = await fs.readFile(eventsFilePath, 'utf8');
    const events: Event[] = JSON.parse(fileContents);
    return NextResponse.json(events);
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

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description: description || '',
      date,
      time,
      createdBy,
      createdAt: new Date().toISOString(),
    };

    let events: Event[] = [];
    try {
      const fileContents = await fs.readFile(eventsFilePath, 'utf8');
      events = JSON.parse(fileContents);
    } catch {
      events = [];
    }

    events.push(newEvent);
    await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));

    return NextResponse.json(newEvent, { status: 201 });
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

    const fileContents = await fs.readFile(eventsFilePath, 'utf8');
    let events: Event[] = JSON.parse(fileContents);

    const eventIndex = events.findIndex((e) => e.id === id);
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Termin nicht gefunden' },
        { status: 404 }
      );
    }

    // Nur der Ersteller darf löschen
    if (events[eventIndex].createdBy !== createdBy) {
      return NextResponse.json(
        { error: 'Du kannst nur deine eigenen Termine löschen' },
        { status: 403 }
      );
    }

    events = events.filter((e) => e.id !== id);
    await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));

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

    const fileContents = await fs.readFile(eventsFilePath, 'utf8');
    const events: Event[] = JSON.parse(fileContents);

    const eventIndex = events.findIndex((e) => e.id === id);
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Termin nicht gefunden' },
        { status: 404 }
      );
    }

    // Nur der Ersteller darf bearbeiten
    if (events[eventIndex].createdBy !== createdBy) {
      return NextResponse.json(
        { error: 'Du kannst nur deine eigenen Termine bearbeiten' },
        { status: 403 }
      );
    }

    // Termin aktualisieren
    if (title) events[eventIndex].title = title;
    if (description !== undefined) events[eventIndex].description = description;
    if (date) events[eventIndex].date = date;
    if (time) events[eventIndex].time = time;

    await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));

    return NextResponse.json(events[eventIndex]);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Fehler beim Bearbeiten des Termins' },
      { status: 500 }
    );
  }
}
