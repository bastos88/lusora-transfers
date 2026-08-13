import { normalizeGeoapifyResults, searchLocations } from './locationApi';

describe('locationApi', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('cria a consulta Geoapify com os parâmetros obrigatórios', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    vi.stubGlobal('fetch', fetchMock);
    await searchLocations('  Porto   Centro ');
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      text: 'porto centro',
      format: 'json',
      lang: 'pt',
      limit: '6',
      filter: 'countrycode:pt',
      bias: 'proximity:-8.6291,41.1579',
    });
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

  it('não chama fetch quando falta a chave', async () => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(searchLocations('Porto')).rejects.toMatchObject({ kind: 'configuration' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
