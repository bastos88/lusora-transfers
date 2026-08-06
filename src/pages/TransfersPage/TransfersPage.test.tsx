import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TransfersPage } from './TransfersPage';
import type { BookingFormValues } from '../../types/travel';

const booking: BookingFormValues = {
  tripType: 'one-way',
  origin: 'Aeroporto do Porto',
  destination: 'Braga',
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
    expect(screen.getByRole('button', { name: /^Minivan disponível/ })).toHaveAttribute('aria-pressed', 'true');
  });
});
