import { useEffect, useState } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(reducedMotionQuery).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
