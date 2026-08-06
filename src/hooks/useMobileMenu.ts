import { useEffect, useState } from 'react';

export interface MobileMenuControls {
  isOpen: boolean;
  handleMenuToggle: () => void;
  handleMenuClose: () => void;
}

export function useMobileMenu(): MobileMenuControls {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleMenuToggle = () => setIsOpen((current) => !current);
  const handleMenuClose = () => setIsOpen(false);

  return { isOpen, handleMenuToggle, handleMenuClose };
}
