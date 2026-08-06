import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  it('apresenta uma mensagem acessível quando o destino está vazio', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Pesquisar transfer' }));

    expect(screen.getByText('Indique o destino da viagem.')).toBeVisible();
    expect(screen.getByLabelText('Destino')).toHaveAttribute('aria-invalid', 'true');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('envia os valores quando os campos obrigatórios são válidos', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Destino'), 'Braga');
    await user.click(screen.getByRole('button', { name: 'Pesquisar transfer' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
