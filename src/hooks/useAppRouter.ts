import { useCallback, useEffect, useState } from 'react';
import type { NavigateFunction } from '../types/travel';

function getPathname(): string {
  return window.location.pathname || '/';
}

function scrollToCurrentLocation(): void {
  const hash = window.location.hash.replace('#', '');

  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  document.getElementById(hash)?.scrollIntoView({ block: 'start' });
}

export function useAppRouter() {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getPathname());
      window.setTimeout(scrollToCurrentLocation, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate: NavigateFunction = useCallback((to, options) => {
    const url = new URL(to, window.location.origin);
    const nextLocation = `${url.pathname}${url.search}${url.hash}`;

    if (options?.replace) {
      window.history.replaceState({}, '', nextLocation);
    } else {
      window.history.pushState({}, '', nextLocation);
    }

    setPathname(url.pathname || '/');
    window.setTimeout(scrollToCurrentLocation, 0);
  }, []);

  return { pathname, navigate };
}
