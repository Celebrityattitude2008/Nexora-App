import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexora Personal Dashboard',
  description: 'A modern personal dashboard for tasks, goals, analytics, and notes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
