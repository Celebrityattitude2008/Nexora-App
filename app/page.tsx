'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { TaskList } from '../components/TaskList';
import { DailyGoals } from '../components/DailyGoals';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { NotesWidget } from '../components/NotesWidget';
import { WeatherCard } from '../components/WeatherCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { AuthPanel } from '../components/AuthPanel';
import { WelcomeCard } from '../components/WelcomeCard';
import { NewsAggregator } from '../components/NewsAggregator';
import { SpotifySearch } from '../components/SpotifySearch';
import { StockMarketTracker } from '../components/StockMarketTracker';
import { MemeGenerator } from '../components/MemeGenerator';
import { CreatorPanel } from '../components/CreatorPanel';
import { NotificationService } from '../components/NotificationService';
import { auth } from '../components/firebase';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 px-6 py-12 sm:px-8 text-center shadow-panel">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500">Loading</p>
            <p className="mt-4 text-2xl sm:text-3xl font-semibold text-white">Preparing your dashboard…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <AuthPanel />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 md:px-10 md:py-8">
      <NotificationService />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-slate-500">Nexora Dashboard</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Your personal productivity hub
            </h1>
            <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
              Track tasks, habits, analytics, notes, and external data in one modern workspace.
            </p>
          </div>
          <div className="flex w-full lg:w-auto flex-col gap-3 sm:gap-4">
            <WelcomeCard user={user} />
            <button
              type="button"
              onClick={async () => await signOut(auth)}
              className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-200 transition hover:bg-amber-400/20 w-full lg:w-auto"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Main Grid - Mobile First Responsive */}
        <section className="space-y-6">
          {/* Top Row: Productivity (full width on mobile, 2 cols on larger) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr]">
            <TaskList />
            <DailyGoals />
          </div>

          {/* Analytics */}
          <AnalyticsPanel />

          {/* News and Spotify (stack on mobile) */}
          <div className="grid gap-6 lg:grid-cols-2">
            <NewsAggregator />
            <SpotifySearch />
          </div>

          {/* Stock and Meme (stack on mobile) */}
          <div className="grid gap-6 lg:grid-cols-2">
            <StockMarketTracker />
            <MemeGenerator />
          </div>

          {/* Right Sidebar items (stack on mobile) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr]">
            <div className="grid gap-6">
              <NotesWidget />
              <WeatherCard />
            </div>
            <div className="grid gap-6">
              <CalendarWidget />
              <CreatorPanel />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
