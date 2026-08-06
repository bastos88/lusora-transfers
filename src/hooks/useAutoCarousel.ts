import { useEffect, useState } from 'react';

interface UseAutoCarouselOptions {
  itemCount: number;
  intervalMs?: number;
  disabled?: boolean;
}

interface AutoCarouselControls {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  moveBy: (direction: number) => void;
}

export function useAutoCarousel({
  itemCount,
  intervalMs = 6000,
  disabled = false,
}: UseAutoCarouselOptions): AutoCarouselControls {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (disabled || itemCount <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [disabled, intervalMs, itemCount]);

  const moveBy = (direction: number) => {
    setActiveIndex((current) => (current + direction + itemCount) % itemCount);
  };

  return { activeIndex, setActiveIndex, moveBy };
}
