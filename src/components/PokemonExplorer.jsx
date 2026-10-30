'use client';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getPokemonIndex } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';
import { useAsyncData } from '@/hooks/useAsyncData';
import Pagination from './Pagination';
import PokemonCard from './PokemonCard';
import ErrorState from './ErrorState';

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-busy="true">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-3xl bg-white" />
      ))}
    </div>
  );
}

/** Listado paginado. La búsqueda (?q=) se escribe desde HeaderSearch. */
export default function PokemonExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const { data: allPokemon, error, loading, reload } = useAsyncData(getPokemonIndex, []);

  const filtered = useMemo(() => {
    if (!allPokemon) return [];
    const q = urlQuery.trim().toLowerCase().replace(/^#/, '');
    if (!q) return allPokemon;
    if (/^\d+$/.test(q)) return allPokemon.filter((p) => String(p.id).startsWith(String(Number(q))));
    return allPokemon.filter((p) => p.name.includes(q));
  }, [allPokemon, urlQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(urlPage, totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => {
    const params = new URLSearchParams();
    if (urlQuery) params.set('q', urlQuery);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <GridSkeleton />;
  if (error) return <ErrorState error={error} what="los Pokémon" onRetry={reload} />;

  return (
    <section>
      <p className="mb-3 text-sm text-slate-600" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">
          No hay Pokémon que coincidan con “{urlQuery}”. Prueba con otro nombre o número.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visible.map((p) => (
            <PokemonCard key={p.id} id={p.id} name={p.name} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
    </section>
  );
}
