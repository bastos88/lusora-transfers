import type { BookingFormValues, PricingBreakdown, TransferService, Vehicle } from '../types/travel';

export function calculatePricing(
  booking: BookingFormValues,
  service: TransferService,
  vehicle: Vehicle,
): PricingBreakdown {
  const journeys = booking.tripType === 'round-trip' ? 2 : 1;
  const pricePerJourney = service.basePrice + vehicle.supplement;

  return {
    journeys,
    servicePrice: service.basePrice,
    vehicleSupplement: vehicle.supplement,
    pricePerJourney,
    total: pricePerJourney * journeys,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
