import { normalizeGeoapifyResults, searchLocations } from './locationApi';

describe('locationApi', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('envia apenas a consulta ao proxy Laravel', async () => {
    
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    vi.stubGlobal('fetch', fetchMock);
    await searchLocations('  Porto   Centro ');
    const url = new URL(String(fetchMock.mock.calls[0][0]), 'http://localhost');
    expect(url.pathname).toBe('/api/locations');
    expect(Object.fromEntries(url.searchParams)).toEqual({q:'porto centro'});
  });

  it('normaliza resultados, converte coordenadas, remove duplicados e descarta inválidos', () => {
    const results = normalizeGeoapifyResults({
      results: [
        {
          place_id: '1',
          formatted: 'Porto, Portugal',
          name: 'Porto',
          city: 'Porto',
          country: 'Portugal',
          country_code: 'pt',
          lat: '41.15',
          lon: '-8.61',
        },
        { place_id: '1', formatted: 'Duplicado', lat: 1, lon: 2 },
        { place_id: '2', formatted: 'Sem latitude', lon: -8 },
        { formatted: 'Sem identificador', lat: 1, lon: 2 },
      ],
    });
    expect(results).toEqual([
      expect.objectContaining({
        id: '1',
        label: 'Porto, Portugal',
        name: 'Porto',
        city: 'Porto',
        countryCode: 'PT',
        latitude: 41.15,
        longitude: -8.61,
      }),
    ]);
  });

  it('apresenta indisponibilidade do backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:false,status:503}));
    await expect(searchLocations('Porto')).rejects.toMatchObject({kind:'http'});
  });
});
