'use client';

/** [1, '…', 4, 5, 6, '…', 42] */
function pageItems(current, total) {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push(`gap-${i}`);
    items.push(p);
  });
  return items;
}

const btn = 'min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Paginación" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button className={`${btn} border-black/10 bg-white`} disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>

      {/* Móvil: contador compacto */}
      <span className="px-2 text-sm text-slate-600 sm:hidden">{page} / {totalPages}</span>

      {/* Escritorio: números de página */}
      <div className="hidden items-center gap-2 sm:flex">
        {pageItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="px-1 text-slate-400">…</span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`${btn} ${item === page ? 'border-dex bg-dex text-white' : 'border-black/10 bg-white hover:border-dex'}`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button className={`${btn} border-black/10 bg-white`} disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  );
}
