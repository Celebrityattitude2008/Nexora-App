'use client';

import { useEffect, useState } from 'react';

export function NotesWidget() {
  const [note, setNote] = useState('Remember to escalate a call with the client tomorrow.');

  useEffect(() => {
    const value = window.localStorage.getItem('dashboard-notes');
    if (value) setNote(value);
  }, []);

  const updateNote = (value: string) => {
    setNote(value);
    window.localStorage.setItem('dashboard-notes', value);
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Notes</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Quick capture</h2>
      </div>
      <textarea
        value={note}
        onChange={(event) => updateNote(event.target.value)}
        className="min-h-[240px] w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 text-slate-100 shadow-inner outline-none transition focus:border-amber-400"
      />
      <div className="mt-4 text-sm text-slate-400">Your notes are stored locally in the browser for privacy.</div>
    </section>
  );
}
