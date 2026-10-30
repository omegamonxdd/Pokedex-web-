'use client';

function WifiOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 2l20 20" />
      <path d="M8.5 16.4a5 5 0 0 1 7 0" />
      <path d="M5 12.9a10 10 0 0 1 5.2-2.7" />
      <path d="M13.8 10.2A10 10 0 0 1 19 12.9" />
      <path d="M2 8.8a15 15 0 0 1 4.2-2.6" />
      <path d="M10.7 5.1A15 15 0 0 1 22 8.8" />
      <path d="M12 20h.01" />
    </svg>
  );
}

/**
 * Estado de error amigable.
 * @param {ApiError} error  error lanzado por lib/api
 * @param {string}   what   qué no se pudo cargar ("los Pokémon", ...)
 * @param {Function} onRetry
 */
export default function ErrorState({ error, what = 'los datos', onRetry }) {
  const type = error?.type;
  let message;

  if (type === 'network') {
    message = (
      <>
        <strong className="font-semibold">Sin conexión a internet.</strong> No se pudieron cargar {what}. Por favor, verifica tu red.
      </>
    );
  } else if (type === 'not-found') {
    message = 'No encontramos ese Pokémon. Revisa el número o el nombre.';
  } else {
    message = `Algo salió mal al cargar ${what}${error?.status ? ` (error ${error.status})` : ''}. Inténtalo de nuevo en unos segundos.`;
  }

  return (
    <div role="alert" className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
      <span className="text-dex"><WifiOffIcon /></span>
      <p className="text-base leading-relaxed text-slate-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full bg-dex px-5 py-2 text-sm font-semibold text-white transition hover:bg-dex-dark">
          Reintentar
        </button>
      )}
    </div>
  );
}
