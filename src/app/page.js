import { Suspense } from 'react';
import PokemonExplorer from '@/components/PokemonExplorer';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-5">
      {/* useSearchParams exige un límite de Suspense */}
      <Suspense fallback={null}>
        <PokemonExplorer />
      </Suspense>
    </div>
  );
}
