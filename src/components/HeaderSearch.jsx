'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Buscador del header. Escribe en la URL (?q=) con debounce:
 *  - en "/" actualiza el listado en tiempo real;
 *  - en otras páginas (detalle) navega al listado con la búsqueda aplicada.
 */
export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname === '/' ? searchParams.get('q') ?? '' : '';

  const [input, setInput] = useState(urlQuery);
  const lastSent = useRef(urlQuery);

  // Si la URL cambia por otra vía (logo, botón atrás), refleja el valor en el input.
  useEffect(() => {
    if (urlQuery !== lastSent.current) {
      lastSent.current = urlQuery;
      setInput(urlQuery);
    }
  }, [urlQuery]);

  // Debounce hacia la URL.
  useEffect(() => {
    const q = input.trim();
    if (q === urlQuery) return;
    const t = setTimeout(() => {
      lastSent.current = q;
      const href = q ? `/?q=${encodeURIComponent(q)}` : '/';
      if (pathname === '/') router.replace(href, { scroll: false });
      else router.push(href);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="w-full md:max-w-xl">
      <label htmlFor="search" className="sr-only">Buscar Pokémon por nombre o número</label>
      <input
        id="search"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Busca por nombre o número (ej. pikachu, 25)"
        className="w-full rounded-full border-2 border-transparent bg-white px-5 py-3 text-base text-ink shadow-md placeholder:text-slate-400 focus:border-ink focus:outline-none"
      />
    </div>
  );
}
