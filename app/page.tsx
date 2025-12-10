'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/event';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    createdBy: '',
  });
  const [currentUser, setCurrentUser] = useState('');
  const [filterPerson, setFilterPerson] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Termine laden
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Fehler beim Laden der Termine:', error);
    }
  };

  // Neuen Termin erstellen oder bearbeiten
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // Termin bearbeiten
      try {
        const response = await fetch('/api/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingEvent.id,
            ...formData,
          }),
        });

        if (response.ok) {
          setFormData({ title: '', description: '', date: '', time: '', createdBy: '' });
          setShowForm(false);
          setEditingEvent(null);
          fetchEvents();
        } else {
          const error = await response.json();
          alert(error.error || 'Fehler beim Bearbeiten');
        }
      } catch (error) {
        console.error('Fehler beim Bearbeiten des Termins:', error);
        alert('Fehler beim Bearbeiten des Termins');
      }
    } else {
      // Neuen Termin erstellen
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setCurrentUser(formData.createdBy);
          setFormData({ title: '', description: '', date: '', time: '', createdBy: formData.createdBy });
          setShowForm(false);
          fetchEvents();
        }
      } catch (error) {
        console.error('Fehler beim Erstellen des Termins:', error);
      }
    }
  };

  // Termin löschen
  const handleDelete = async (event: Event) => {
    const userName = prompt('Gib deinen Namen ein, um zu bestätigen:');
    if (!userName) return;

    try {
      const response = await fetch(`/api/events?id=${event.id}&createdBy=${encodeURIComponent(userName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Termins');
    }
  };

  // Termin bearbeiten vorbereiten
  const handleEdit = (event: Event) => {
    const userName = prompt('Gib deinen Namen ein, um zu bestätigen:');
    if (!userName || userName !== event.createdBy) {
      alert('Du kannst nur deine eigenen Termine bearbeiten');
      return;
    }

    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      createdBy: event.createdBy,
    });
    setShowForm(true);
  };

  // Export als iCal
  const exportIcal = () => {
    const icalEvents = events.map((event) => {
      const start = new Date(`${event.date}T${event.time}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 Stunde

      return `BEGIN:VEVENT
UID:${event.id}@vibedezember
DTSTAMP:${new Date(event.createdAt).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
ORGANIZER:${event.createdBy}
END:VEVENT`;
    }).join('\n');

    const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vibedezember//Terminkalender//DE
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icalEvents}
END:VCALENDAR`;

    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'termine.ics';
    a.click();
  };

  // Export als CSV
  const exportCsv = () => {
    const csv = [
      ['Titel', 'Beschreibung', 'Datum', 'Uhrzeit', 'Erstellt von'].join(';'),
      ...events.map((event) => [
        event.title,
        event.description,
        event.date,
        event.time,
        event.createdBy,
      ].map(field => `"${field}"`).join(';')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'termine.csv';
    a.click();
  };

  // Kalenderfunktionen
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];

    return getFilteredEvents().filter((event) => event.date === dateStr);
  };

  // Gefilterte Termine
  const getFilteredEvents = () => {
    return events.filter((event) => {
      if (filterPerson && !event.createdBy.toLowerCase().includes(filterPerson.toLowerCase())) {
        return false;
      }
      if (filterDateFrom && event.date < filterDateFrom) {
        return false;
      }
      if (filterDateTo && event.date > filterDateTo) {
        return false;
      }
      return true;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Alle Personen für Filter
  const allPeople = Array.from(new Set(events.map((e) => e.createdBy))).sort();

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gemeinsamer Terminkalender
          </h1>
          <p className="text-gray-600">
            Trage deine Termine ein und sehe, was andere geplant haben
          </p>
        </div>

        {/* Filter & Export */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter & Export</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nach Person filtern
              </label>
              <select
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Alle Personen</option>
                {allPeople.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Von Datum
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bis Datum
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setFilterPerson('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Filter zurücksetzen
            </button>
            <button
              onClick={exportIcal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              📅 Als iCal exportieren
            </button>
            <button
              onClick={exportCsv}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              📊 Als CSV exportieren
            </button>
          </div>
        </div>

        {/* Kalender Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              ← Zurück
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Weiter →
            </button>
          </div>

          {/* Wochentage */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Kalendertage */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-200'
                  } hover:shadow-md transition`}
                >
                  <div className={`text-sm font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate"
                        title={`${event.time} - ${event.title} (${event.createdBy})`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button für neuen Termin */}
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingEvent(null);
              if (!showForm) {
                setFormData({
                  title: '',
                  description: '',
                  date: '',
                  time: '',
                  createdBy: currentUser,
                });
              }
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-lg"
          >
            {showForm ? 'Formular schließen' : '+ Neuen Termin eintragen'}
          </button>
        </div>

        {/* Formular */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingEvent ? 'Termin bearbeiten' : 'Neuen Termin eintragen'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dein Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  disabled={!!editingEvent}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Max Mustermann"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Meeting, Geburtstag, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Weitere Details zum Termin..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uhrzeit *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  {editingEvent ? 'Änderungen speichern' : 'Termin speichern'}
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null);
                      setShowForm(false);
                    }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Abbrechen
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Liste aller Termine */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {filterPerson || filterDateFrom || filterDateTo ? 'Gefilterte ' : 'Alle '}
            Termine ({filteredEvents.length})
          </h3>
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {filterPerson || filterDateFrom || filterDateTo
                ? 'Keine Termine gefunden mit den aktuellen Filtern.'
                : 'Noch keine Termine eingetragen. Sei der Erste!'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredEvents
                .sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.time}`);
                  const dateB = new Date(`${b.date}T${b.time}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {event.title}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          ✏️ Bearbeiten
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          🗑️ Löschen
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      von {event.createdBy}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      📅 {new Date(event.date).toLocaleDateString('de-DE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} um {event.time} Uhr
                    </div>
                    {event.description && (
                      <p className="text-gray-700 text-sm">{event.description}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
