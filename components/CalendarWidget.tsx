'use client';

import { useEffect, useMemo, useState } from 'react';
import { onValue, push } from 'firebase/database';
import { calendarEventsRef } from './firebase';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  description?: string;
};

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const unsubscribe = onValue(calendarEventsRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) {
        setEvents([]);
        return;
      }

      const parsed = Object.entries(value).map(([key, item]) => ({
        id: key,
        ...(item as Omit<CalendarEvent, 'id'>),
      }));
      setEvents(parsed);
    });

    return () => unsubscribe();
  }, []);

  const upcomingEvents = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const createEvent = async () => {
    if (!title.trim() || !date) return;
    await push(calendarEventsRef, {
      title: title.trim(),
      date,
      description: description.trim(),
    });
    setTitle('');
    setDate('');
    setDescription('');
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Calendar</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Create and track events</h2>
        </div>
        <div className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm text-slate-300">Realtime sync</div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4">
        <div className="grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Event title"
            className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Optional details"
            className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"
          />
          <button
            onClick={createEvent}
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Add event
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {upcomingEvents.length ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-3xl border border-slate-700/60 bg-slate-950/90 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="text-sm text-slate-400">{event.date}</p>
                  </div>
                  <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Event
                  </span>
                </div>
                {event.description ? <p className="mt-3 text-sm text-slate-400">{event.description}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/90 p-4 text-slate-400">
              No calendar events yet. Add one to begin planning your week.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
