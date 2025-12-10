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
