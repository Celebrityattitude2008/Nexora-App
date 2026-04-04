'use client';

import { User } from 'firebase/auth';

interface WelcomeCardProps {
  user: User;
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="rounded-[2rem] border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-950/90 p-6 shadow-panel animate-slide-up-fade backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-2xl font-bold text-slate-950 shadow-lg shadow-amber-500/30">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              firstLetter
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Welcome back</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">{displayName}</h3>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
            {!user.emailVerified && (
              <p className="mt-2 flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Email pending verification
              </p>
            )}
          </div>
        </div>
      </div>

      {!user.emailVerified && (
        <div className="mt-4 rounded-3xl border border-amber-400/30 bg-amber-500/5 px-4 py-3">
          <p className="text-sm text-slate-200">
            Check your email for a verification link. This helps us keep your account secure.
          </p>
        </div>
      )}
    </div>
  );
}
