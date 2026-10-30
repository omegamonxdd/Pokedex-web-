'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * Ejecuta `fetcher` y expone { data, error, loading, reload }.
 * Si falló por red y la conexión vuelve, reintenta automáticamente.
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);
  const isOnline = useOnlineStatus();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, error: null, loading: true });
    fetcherRef
      .current()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  // Reintento automático al recuperar la conexión.
  const wasOffline = useRef(false);
  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    } else if (wasOffline.current) {
      wasOffline.current = false;
      if (state.error?.type === 'network') setAttempt((a) => a + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, reload };
}
