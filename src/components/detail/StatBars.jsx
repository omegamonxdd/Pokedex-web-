import { STAT_LABELS } from '@/lib/constants';

const MAX_STAT = 255;
const barColor = (v) => (v < 50 ? '#e5675c' : v < 80 ? '#f2a33c' : v < 110 ? '#9acb52' : '#3fb98a');

export default function StatBars({ stats }) {
  const total = stats.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className="space-y-3">
      {stats.map(({ name, value }) => (
        <div key={name} className="grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-3 text-sm">
          <span className="text-slate-600">{STAT_LABELS[name] ?? name}</span>
          <span className="text-right font-semibold tabular-nums">{value}</span>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-surface"
            role="progressbar"
            aria-label={STAT_LABELS[name] ?? name}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={MAX_STAT}
          >
            <div className="h-full rounded-full" style={{ width: `${(value / MAX_STAT) * 100}%`, background: barColor(value) }} />
          </div>
        </div>
      ))}
      <p className="border-t border-black/5 pt-3 text-sm text-slate-600">
        Total: <span className="font-semibold text-ink">{total}</span>
      </p>
    </div>
  );
}
