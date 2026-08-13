import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { BookingConfirmation } from '../../types/travel';
import { CustomerAreaPage } from './CustomerAreaPage';

const confirmation: BookingConfirmation = {
  reference: 'GT-260813-ABC12',
  booking: {
    tripType: 'one-way',
    origin: {
      id: '1',
      label: 'Aeroporto do Porto',
      name: 'Aeroporto do Porto',
      country: 'Portugal',
      countryCode: 'pt',
      latitude: 41.24,
      longitude: -8.67,
    },
    destination: {
      id: '2',
      label: 'Ribeira, Porto',
      name: 'Ribeira',
      country: 'Portugal',
      countryCode: 'pt',
      latitude: 41.14,
      longitude: -8.61,
    },
    departureDate: '2026-08-20',
    departureTime: '10:00',
    returnDate: '',
    returnTime: '',
    passengers: 2,
  },
  serviceId: 'essential',
  vehicleId: 'standard',
  customer: {
    fullName: 'Leonardo Bastos',
    email: 'leo@example.com',
    phone: '912345678',
    flightNumber: 'TP123',
    notes: '',
    paymentMethod: 'cash',
    acceptTerms: true,
  },
  total: 35,
  createdAt: '2026-08-13T10:00:00.000Z',
};

describe('CustomerAreaPage', () => {
  it('apresenta os detalhes da reserva confirmada', () => {
    render(
      <CustomerAreaPage
        view="booking"
        user={{ name: 'Leonardo Bastos', email: 'leo@example.com', phone: '912345678' }}
        confirmation={confirmation}
        onLogout={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText('GT-260813-ABC12')).toBeInTheDocument();
    expect(screen.getByText('Aeroporto do Porto')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Aeroporto do Porto.*Ribeira, Porto/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Leonardo Bastos' })).toBeInTheDocument();
  });

  it('permite aceder às informações pessoais', async () => {
    const user = userEvent.setup();
    const handleNavigate = vi.fn();
    render(
      <CustomerAreaPage
        view="booking"
        user={{ name: 'Leonardo Bastos', email: 'leo@example.com' }}
        confirmation={null}
        onLogout={vi.fn()}
        onNavigate={handleNavigate}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Informações pessoais/ }));
    expect(handleNavigate).toHaveBeenCalledWith('/informacoes-pessoais');
  });
});
