import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import type * as ProviderModule from '../features/AppProvider';
import { afterEach,vi } from 'vitest';
vi.mock('../features/AppProvider', async (original) => ({
 ...await original<typeof ProviderModule>(),
 useCatalog:()=>({vehicles:awaitCatalog.vehicles,transferServices:awaitCatalog.transferServices,testimonials:awaitCatalog.testimonials,faqs:awaitCatalog.faqs}),
}));
import { vehicles } from '../data/vehicles';
import { transferServices } from '../data/transferServices';
import { testimonials } from '../data/testimonials';
import { faqs } from '../data/faqs';
const awaitCatalog={vehicles,transferServices,testimonials,faqs};

afterEach(() => cleanup());

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
