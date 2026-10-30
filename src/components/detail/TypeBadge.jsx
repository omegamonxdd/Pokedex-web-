import { TYPE_INFO } from '@/lib/constants';
import { readableTextColor } from '@/lib/formatters';

/** variant "solid": fondo del color del tipo. "onColor": para usarlo sobre un fondo ya coloreado. */
export default function TypeBadge({ type, variant = 'solid' }) {
  const info = TYPE_INFO[type] ?? { label: type, color: '#888888' };
  if (variant === 'onColor') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
        {info.label}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
      style={{ background: info.color, color: readableTextColor(info.color) }}
    >
      {info.label}
    </span>
  );
}
