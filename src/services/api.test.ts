function response(status: number, body: unknown = {}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('api', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it('reutiliza a inicialização CSRF entre pedidos de escrita', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(response(204))
      .mockResolvedValueOnce(response(204))
      .mockResolvedValueOnce(response(204));
    const { api } = await import('./api');

    await api('/first', { method: 'POST' });
    await api('/second', { method: 'POST' });

    expect(fetchMock.mock.calls.filter(([url]) => url === '/sanctum/csrf-cookie')).toHaveLength(1);
  });

  it('renova o CSRF e repete uma vez quando recebe 419', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(response(204))
      .mockResolvedValueOnce(response(419))
      .mockResolvedValueOnce(response(204))
      .mockResolvedValueOnce(response(200, { data: { id: 1 } }));
    const { api } = await import('./api');

    await expect(api('/bookings', { method: 'POST' })).resolves.toEqual({ data: { id: 1 } });
    expect(fetchMock.mock.calls.filter(([url]) => url === '/sanctum/csrf-cookie')).toHaveLength(2);
  });
});
