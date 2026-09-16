import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TransfersPage } from './TransfersPage';
import type { BookingFormValues } from '../../types/travel';

const booking: BookingFormValues = {
  tripType: 'one-way',
  origin: {
    id: 'porto-airport',
    label: 'Aeroporto do Porto, Maia, Portugal',
    name: 'Aeroporto do Porto',
    city: 'Maia',
    country: 'Portugal',
    countryCode: 'PT',
    latitude: 41.2421,
    longitude: -8.6786,
  },
  destination: {
    id: 'braga',
    label: 'Braga, Portugal',
    name: 'Braga',
    city: 'Braga',
    country: 'Portugal',
    countryCode: 'PT',
    latitude: 41.5518,
    longitude: -8.4229,
  },
  departureDate: '2027-08-10',
  departureTime: '10:00',
  returnDate: '',
  returnTime: '',
  passengers: 4,
};

describe('TransfersPage', () => {
  it('permite selecionar um serviço e desativa viaturas sem capacidade', async () => {
    const user = userEvent.setup();
    const handleServiceSelect = vi.fn();

    render(
      <TransfersPage
        user={null}
        booking={booking}
        selectedServiceId={null}
        selectedVehicleId="minivan"
        onServiceSelect={handleServiceSelect}
        onVehicleSelect={vi.fn()}
        onContinue={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('radio', { name: /Meet & Greet/ }));

    expect(handleServiceSelect).toHaveBeenCalledWith('meet-and-greet');
    expect(screen.getByRole('button', { name: /Standard/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^Minivan disponível/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
