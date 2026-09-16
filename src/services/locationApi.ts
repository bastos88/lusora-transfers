import type { LocationOption } from '../types/travel';


type LocationApiErrorKind = 'configuration' | 'network' | 'invalid-response' | 'rate-limit' | 'http';

interface GeoapifyResult {
  place_id?: unknown;
  formatted?: unknown;
  name?: unknown;
  address_line1?: unknown;
  city?: unknown;
  town?: unknown;
  village?: unknown;
  municipality?: unknown;
  postcode?: unknown;
  country?: unknown;
  country_code?: unknown;
  lat?: unknown;
  lon?: unknown;
  result_type?: unknown;
}

interface GeoapifyResponse {
  results?: unknown;
}

export class LocationApiError extends Error {
  readonly kind: LocationApiErrorKind;

  constructor(kind: LocationApiErrorKind, message: string) {
    super(message);
    this.name = 'LocationApiError';
    this.kind = kind;
  }
}

export function normalizeLocationQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-PT');
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function normalizeGeoapifyResults(payload: unknown): LocationOption[] {
  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as GeoapifyResponse).results)) {
    throw new LocationApiError(
      'invalid-response',
      'O serviço devolveu uma resposta inválida. Tente novamente.',
    );
  }

  const seen = new Set<string>();
  const locations: LocationOption[] = [];

  for (const rawResult of (payload as { results: unknown[] }).results) {
    if (!rawResult || typeof rawResult !== 'object') continue;

    const result = rawResult as GeoapifyResult;
    const id = optionalString(result.place_id);
    const label = optionalString(result.formatted);
    const latitude =
      typeof result.lat === 'number' || typeof result.lat === 'string' ? Number(result.lat) : Number.NaN;
    const longitude =
      typeof result.lon === 'number' || typeof result.lon === 'string' ? Number(result.lon) : Number.NaN;

    if (!id || !label || !Number.isFinite(latitude) || !Number.isFinite(longitude) || seen.has(id)) {
      continue;
    }

    seen.add(id);
    const city =
      optionalString(result.city) ??
      optionalString(result.town) ??
      optionalString(result.village) ??
      optionalString(result.municipality);

    locations.push({
      id,
      label,
      name: optionalString(result.name) ?? optionalString(result.address_line1) ?? city ?? label,
      ...(city ? { city } : {}),
      ...(optionalString(result.postcode) ? { postcode: optionalString(result.postcode) } : {}),
      country: optionalString(result.country) ?? 'Portugal',
      countryCode: (optionalString(result.country_code) ?? 'pt').toLocaleUpperCase('pt-PT'),
      latitude,
      longitude,
      ...(optionalString(result.result_type) ? { resultType: optionalString(result.result_type) } : {}),
    });
  }

  return locations;
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationOption[]> {
  const normalizedQuery = normalizeLocationQuery(query);
  const url = '/api/locations?q=' + encodeURIComponent(normalizedQuery);

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new LocationApiError(
      'network',
      'Não foi possível contactar o serviço de localidades. Tente novamente.',
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new LocationApiError(
        'rate-limit',
        'O limite de pesquisas foi atingido. Aguarde um momento e tente novamente.',
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new LocationApiError(
        'configuration',
        'A pesquisa de localidades não está configurada corretamente.',
      );
    }
    throw new LocationApiError('http', 'O serviço de localidades está indisponível. Tente novamente.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new LocationApiError(
      'invalid-response',
      'O serviço devolveu uma resposta inválida. Tente novamente.',
    );
  }

  return normalizeGeoapifyResults(payload);
}
