'use client';
import { useState } from 'react';

/** Descripciones de Pokédex: selector de región + una tarjeta por juego con registro. */
export default function PokedexEntries({ entries }) {
  const [region, setRegion] = useState(entries[0]?.region);

  if (entries.length === 0) {
    return <p className="text-slate-600">Este Pokémon no tiene descripciones registradas.</p>;
  }
  const current = entries.find((e) => e.region === region) ?? entries[0];

  return (
    <div>
      <div role="tablist" aria-label="Región" className="flex flex-wrap gap-2">
        {entries.map((e) => (
          <button
            key={e.region}
            role="tab"
            aria-selected={e.region === current.region}
            onClick={() => setRegion(e.region)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              e.region === current.region ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white hover:border-ink'
            }`}
          >
            {e.region}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3" role="tabpanel">
        {current.games.map((g) => (
          <li key={g.id} className="rounded-2xl bg-surface p-4">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
              Pokémon {g.label}
              {g.lang === 'en' && (
                <span className="rounded bg-white px-1.5 py-0.5 text-xs font-medium text-slate-500" title="Sin traducción al español">EN</span>
              )}
            </p>
            <p className="max-w-prose leading-relaxed text-slate-700">{g.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
