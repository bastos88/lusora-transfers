import { useEffect, useRef, useState } from 'react';
import { LocationApiError, normalizeLocationQuery, searchLocations } from '../services/locationApi';
import type { LocationOption } from '../types/travel';

const MINIMUM_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 350;
const resultCache = new Map<string, LocationOption[]>();

export type LocationAutocompleteStatus = 'idle' | 'loading' | 'success' | 'error';

export function clearLocationAutocompleteCache(): void {
  resultCache.clear();
}

export function useLocationAutocomplete(query: string) {
  const [results, setResults] = useState<LocationOption[]>([]);
  const [status, setStatus] = useState<LocationAutocompleteStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const requestSequence = useRef(0);
  const normalizedQuery = normalizeLocationQuery(query);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    const controller = new AbortController();

    if (normalizedQuery.length < MINIMUM_QUERY_LENGTH) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return () => controller.abort();
    }

    const cachedResults = resultCache.get(normalizedQuery);
    if (cachedResults) {
      setResults(cachedResults);
      setStatus('success');
      setError(null);
      return () => controller.abort();
    }

    setStatus('loading');
    setError(null);
    const timeoutId = window.setTimeout(() => {
      void searchLocations(normalizedQuery, controller.signal)
        .then((locations) => {
          if (controller.signal.aborted || sequence !== requestSequence.current) return;
          resultCache.set(normalizedQuery, locations);
          setResults(locations);
          setStatus('success');
        })
        .catch((caughtError: unknown) => {
          if (controller.signal.aborted || sequence !== requestSequence.current) return;
          if (caughtError instanceof DOMException && caughtError.name === 'AbortError') return;
          setResults([]);
          setStatus('error');
          setError(
            caughtError instanceof LocationApiError
              ? caughtError.message
              : 'Não foi possível pesquisar localidades. Tente novamente.',
          );
        });
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalizedQuery, retryVersion]);

  return {
    results,
    status,
    error,
    retry: () => setRetryVersion((version) => version + 1),
  };
}
