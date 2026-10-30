'use client';
import { useState } from 'react';
import Link from 'next/link';
import { artworkUrl, formatDexNumber, formatName } from '@/lib/formatters';

export default function PokemonCard({ id, name }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link
      href={`/pokemon/${id}`}
      className="group flex flex-col items-center rounded-3xl border border-black/5 bg-white p-4 shadow-sm transition hover:border-dex/40 hover:shadow-md"
    >
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-surface">
        {failed ? (
          <span className="text-sm text-slate-400">Sin imagen</span>
        ) : (
          <img
            src={artworkUrl(id)}
            alt=""
            loading="lazy"
            width={160}
            height={160}
            onError={() => setFailed(true)}
            className="h-4/5 w-4/5 object-contain transition group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{formatDexNumber(id)}</p>
      <h2 className="font-display text-lg font-bold leading-tight">{formatName(name)}</h2>
    </Link>
  );
}
