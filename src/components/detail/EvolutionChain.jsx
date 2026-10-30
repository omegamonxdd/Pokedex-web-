'use client';
import Link from 'next/link';
import { artworkUrl, formatDexNumber, formatName } from '@/lib/formatters';

function EvoCard({ node, current }) {
  const content = (
    <>
      <img src={artworkUrl(node.id)} alt="" loading="lazy" width={96} height={96} className="h-24 w-24 object-contain" />
      <span className="text-xs text-slate-500">{formatDexNumber(node.id)}</span>
      <span className="font-display font-bold">{formatName(node.name)}</span>
    </>
  );
  const cls = `flex w-32 flex-col items-center rounded-2xl p-3 text-center ${
    current ? 'bg-dex/10 ring-2 ring-dex' : 'bg-surface transition hover:ring-2 hover:ring-dex/40'
  }`;
  return current ? (
    <div className={cls} aria-current="true">{content}</div>
  ) : (
    <Link href={`/pokemon/${node.id}`} className={cls}>{content}</Link>
  );
}

/** Flecha + método de evolución entre dos etapas. */
function Connector({ methods }) {
  return (
    <div className="flex max-w-[11rem] flex-col items-center gap-1 text-center text-xs text-slate-600">
      <span aria-hidden className="text-lg text-dex">
        <span className="md:hidden">↓</span>
        <span className="hidden md:inline">→</span>
      </span>
      {methods.length ? methods.map((m) => <span key={m}>{m}</span>) : <span>Método desconocido</span>}
    </div>
  );
}

/** Renderiza recursivamente el árbol (soporta ramas, ej. Eevee). */
function Branch({ node, currentId }) {
  return (
    <div className="flex flex-col items-center gap-3 md:flex-row">
      <EvoCard node={node} current={node.id === currentId} />
      {node.children.length > 0 && (
        <div className="flex flex-col gap-5">
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center gap-3 md:flex-row">
              <Connector methods={child.methods} />
              <Branch node={child} currentId={currentId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EvolutionChain({ evolution, currentId }) {
  if (!evolution || evolution.children.length === 0) {
    return <p className="text-slate-600">Este Pokémon no evoluciona ni tiene preevoluciones.</p>;
  }
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-min justify-center">
        <Branch node={evolution} currentId={currentId} />
      </div>
    </div>
  );
}
