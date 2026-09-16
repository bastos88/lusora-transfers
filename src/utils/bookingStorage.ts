import type { BookingFormValues, LocationOption } from '../types/travel';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isLocationOption(value: unknown): value is LocationOption {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.name === 'string' &&
    typeof value.country === 'string' &&
    typeof value.countryCode === 'string' &&
    typeof value.latitude === 'number' &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude)
  );
}

export function parseStoredBooking(value: unknown): BookingFormValues | null {
  if (!isRecord(value) || !isLocationOption(value.origin) || !isLocationOption(value.destination)) {
    return null;
  }

  if (
    (value.tripType !== 'one-way' && value.tripType !== 'round-trip') ||
    typeof value.departureDate !== 'string' ||
    typeof value.departureTime !== 'string' ||
    typeof value.returnDate !== 'string' ||
    typeof value.returnTime !== 'string' ||
    typeof value.passengers !== 'number'
  ) {
    return null;
  }

  return value as unknown as BookingFormValues;
}

