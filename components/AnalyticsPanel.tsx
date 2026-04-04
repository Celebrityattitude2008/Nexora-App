'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Hours worked',
      data: [4, 6, 5, 7, 6.5, 4.5, 5],
      borderColor: '#fbbf24',
      backgroundColor: 'rgba(251, 191, 36, 0.24)',
      tension: 0.35,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#fbbf24',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#cbd5e1' },
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#111827',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
    },
  },
  scales: {
    x: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(148, 163, 184, 0.18)' },
    },
    y: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(148, 163, 184, 0.18)' },
    },
  },
};

export function AnalyticsPanel() {
  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Analytics</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Productivity metrics</h2>
        </div>
        <div className="rounded-2xl bg-slate-800/90 px-4 py-3 text-right text-sm text-slate-300">
          <p>Completed tasks</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">32</p>
        </div>
      </div>
      <div className="h-[320px] rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
