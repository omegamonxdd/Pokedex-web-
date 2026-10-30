import { Suspense } from 'react';
import Link from 'next/link';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import HeaderSearch from '@/components/HeaderSearch';
import NetworkBanner from '@/components/NetworkBanner';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: 'Pokédex',
  description: 'Explora todos los Pokémon: tipos, estadísticas, evoluciones y descripciones por juego.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <header className="bg-dex shadow-md">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
            <Link href="/" className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight text-white">
              <span
                aria-hidden
                className="relative h-9 w-9 shrink-0 rounded-full border-[3px] border-white bg-gradient-to-b from-dex-dark from-50% to-white to-50%"
              >
                <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-dex-dark bg-white" />
              </span>
              Pokédex
            </Link>
            <Suspense fallback={<div className="h-12 w-full md:max-w-xl" />}>
              <HeaderSearch />
            </Suspense>
          </div>
        </header>
        <NetworkBanner />
        <main>{children}</main>
      </body>
    </html>
  );
}
