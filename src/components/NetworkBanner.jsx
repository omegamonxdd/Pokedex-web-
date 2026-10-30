'use client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/** Aviso global cuando el navegador pierde la conexión. */
export default function NetworkBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div role="status" className="bg-ink px-4 py-2 text-center text-sm font-medium text-white">
      Sin conexión a internet. Algunos datos pueden no estar disponibles.
    </div>
  );
}
