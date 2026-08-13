import { act, renderHook } from '@testing-library/react';
import type { LocationOption } from '../types/travel';
import { searchLocations } from '../services/locationApi';
import { clearLocationAutocompleteCache, useLocationAutocomplete } from './useLocationAutocomplete';

vi.mock('../services/locationApi', () => ({
  LocationApiError: class LocationApiError extends Error {},
  normalizeLocationQuery: (query: string) => query.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-PT'),
  searchLocations: vi.fn(),
}));

const option: LocationOption = {
  id: 'porto',
  label: 'Porto, Portugal',
  name: 'Porto',
  city: 'Porto',
  country: 'Portugal',
  countryCode: 'PT',
  latitude: 41.15,
  longitude: -8.61,
};

describe('useLocationAutocomplete', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearLocationAutocompleteCache();
    vi.mocked(searchLocations).mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it('não pesquisa com menos de três caracteres e agrega digitação rápida', async () => {
    vi.mocked(searchLocations).mockResolvedValue([option]);
    const { rerender } = renderHook(({ query }) => useLocationAutocomplete(query), {
      initialProps: { query: 'P' },
    });
    rerender({ query: 'Po' });
    await act(async () => vi.advanceTimersByTime(400));
    expect(searchLocations).not.toHaveBeenCalled();

    rerender({ query: 'Por' });
    rerender({ query: 'Port' });
    rerender({ query: 'Porto' });
    await act(async () => vi.advanceTimersByTime(350));
    expect(searchLocations).toHaveBeenCalledTimes(1);
    expect(searchLocations).toHaveBeenCalledWith('porto', expect.any(AbortSignal));
  });

  it('aborta a pesquisa anterior quando a consulta muda', async () => {
    vi.mocked(searchLocations).mockImplementation(() => new Promise(() => undefined));
    const { rerender } = renderHook(({ query }) => useLocationAutocomplete(query), {
      initialProps: { query: 'Porto' },
    });
    await act(async () => vi.advanceTimersByTime(350));
    const firstSignal = vi.mocked(searchLocations).mock.calls[0][1];
    rerender({ query: 'Braga' });
    expect(firstSignal?.aborted).toBe(true);
  });
});
