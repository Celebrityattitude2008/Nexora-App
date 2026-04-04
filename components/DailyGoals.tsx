'use client';

import { useMemo, useState } from 'react';

type Goal = {
  id: string;
  label: string;
  current: number;
  total: number;
};

const defaultGoals: Goal[] = [
  { id: 'goal-1', label: 'Drink 8 glasses of water', current: 5, total: 8 },
  { id: 'goal-2', label: 'Read 30 minutes', current: 18, total: 30 },
  { id: 'goal-3', label: 'Go for a run', current: 1, total: 1 },
];

export function DailyGoals() {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.current >= goal.total).length, [goals]);

  const increment = (goalId: string) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? { ...goal, current: Math.min(goal.total, goal.current + 1) }
          : goal,
      ),
    );
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Daily Goals</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Habit tracking made simple</h2>
        </div>
        <div className="rounded-2xl bg-slate-800/90 px-4 py-3 text-right text-sm text-slate-300">
          <p>{completedGoals}/{goals.length} completed</p>
        </div>
      </div>

      <div className="space-y-5">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.total) * 100);
          return (
            <div key={goal.id} className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">{goal.label}</p>
                  <p className="text-sm text-slate-400">{goal.current}/{goal.total} completed</p>
                </div>
                <button
                  onClick={() => increment(goal.id)}
                  className="rounded-full border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/10"
                >
                  Add
                </button>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
