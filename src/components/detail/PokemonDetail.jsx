'use client';
import { useRouter } from 'next/navigation';
import { getPokemonDetail } from '@/lib/api';
import { TYPE_INFO } from '@/lib/constants';
import { artworkUrl, formatDexNumber, formatName, readableTextColor } from '@/lib/formatters';
import { useAsyncData } from '@/hooks/useAsyncData';
import ErrorState from '../ErrorState';
import Section from './Section';
import TypeBadge from './TypeBadge';
import StatBars from './StatBars';
import EvolutionChain from './EvolutionChain';
import Matchups from './Matchups';
import PokedexEntries from './PokedexEntries';

function DetailSkeleton() {
  return (
    <div className="mt-4 space-y-4" aria-busy="true">
      <div className="h-72 animate-pulse rounded-3xl bg-white" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    </div>
  );
}

function DetailContent({ p }) {
  const color = TYPE_INFO[p.types[0]]?.color ?? '#A8A77A';
  const fg = readableTextColor(color);

  return (
    <div className="mt-4 space-y-4">
      {/* Cabecera: sprite oficial, nombre, número, especie, región y tipos */}
      <section
        className="overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: `linear-gradient(160deg, ${color} 0%, ${color}cc 55%, ${color}88 100%)`, color: fg }}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <img
            src={artworkUrl(p.id)}
            alt={`Arte oficial de ${formatName(p.name)}`}
            width={288}
            height={288}
            className="h-56 w-56 shrink-0 drop-shadow-xl sm:h-72 sm:w-72"
          />
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-semibold opacity-80">{formatDexNumber(p.id)}</p>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{formatName(p.name)}</h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {p.types.map((t) => <TypeBadge key={t} type={t} variant="onColor" />)}
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-x-10 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="opacity-75">Especie</dt>
                <dd className="text-base font-semibold">{p.genus}</dd>
              </div>
              <div>
                <dt className="opacity-75">Región de introducción</dt>
                <dd className="text-base font-semibold">{p.region} (Gen. {p.generation})</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Habilidades">
          <ul className="space-y-2">
            {p.abilities.map((a) => (
              <li key={a.name} className="flex items-center justify-between rounded-2xl bg-surface px-4 py-2.5">
                <span className="font-medium">{a.label}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.isHidden ? 'bg-ink text-white' : 'bg-white text-slate-600'}`}>
                  {a.isHidden ? 'Oculta' : 'Normal'}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Estadísticas base">
          <StatBars stats={p.stats} />
        </Section>
      </div>

      <Section title="Línea evolutiva">
        <EvolutionChain evolution={p.evolution} currentId={p.id} />
      </Section>

      <Section title="Debilidades y resistencias">
        <Matchups matchups={p.matchups} />
      </Section>

      <Section title="Descripciones de la Pokédex">
        <PokedexEntries entries={p.entries} />
      </Section>
    </div>
  );
}

export default function PokemonDetail({ id }) {
  const router = useRouter();
  const { data, error, loading, reload } = useAsyncData(() => getPokemonDetail(id), [id]);
  const goBack = () => (window.history.length > 1 ? router.back() : router.push('/'));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-4">
      <button onClick={goBack} className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold transition hover:border-ink">
        ← Volver al listado
      </button>

      {loading && <DetailSkeleton />}
      {!loading && error && <ErrorState error={error} what="la información de este Pokémon" onRetry={reload} />}
      {!loading && data && <DetailContent p={data} />}
    </div>
  );
}
