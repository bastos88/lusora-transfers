import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { LocationOption } from '../../types/travel';
import { BookingForm } from './BookingForm';

vi.mock('../LocationAutocomplete/LocationAutocomplete', () => ({
  LocationAutocomplete: ({
    label,
    value,
    error,
    onChange,
  }: {
    label: string;
    value: LocationOption | null;
    error?: string;
    onChange: (location: LocationOption | null) => void;
  }) => (
    <div>
      <label>
        {label}
        <input aria-invalid={Boolean(error)} value={value?.label ?? ''} onChange={() => onChange(null)} />
      </label>
      <button
        type="button"
        onClick={() =>
          onChange({
            id: 'porto',
            label: 'Porto, Portugal',
            name: 'Porto',
            country: 'Portugal',
            countryCode: 'PT',
            latitude: 41.15,
            longitude: -8.61,
          })
        }
      >
        Selecionar Porto para {label}
      </button>
      <button
        type="button"
        onClick={() =>
          onChange({
            id: 'braga',
            label: 'Braga, Portugal',
            name: 'Braga',
            country: 'Portugal',
            countryCode: 'PT',
            latitude: 41.55,
            longitude: -8.42,
          })
        }
      >
        Selecionar Braga para {label}
      </button>
      {error ? <p>{error}</p> : null}
    </div>
  ),
}));

describe('BookingForm', () => {
  it('rejeita texto não selecionado', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);
    await user.type(screen.getByLabelText('Destino'), 'Braga');
    await user.click(screen.getByRole('button', { name: 'Pesquisar transfer' }));
    expect(screen.getByText('Indique o destino da viagem.')).toBeVisible();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('rejeita origem igual ao destino', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Selecionar Porto para Origem' }));
    await user.click(screen.getByRole('button', { name: 'Selecionar Porto para Destino' }));
    await user.click(screen.getByRole('button', { name: 'Pesquisar transfer' }));
    expect(screen.getByText('O destino deve ser diferente da origem.')).toBeVisible();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('envia as opções completas quando o formulário é válido', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Selecionar Porto para Origem' }));
    await user.click(screen.getByRole('button', { name: 'Selecionar Braga para Destino' }));
    fireEvent.change(screen.getByLabelText('Partida'), { target: { value: '2099-08-10' } });
    fireEvent.change(screen.getByLabelText('Volta'), { target: { value: '2099-08-12' } });
    await user.click(screen.getByRole('button', { name: 'Pesquisar transfer' }));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: expect.objectContaining({
          id: 'porto',
          label: 'Porto, Portugal',
          latitude: 41.15,
          longitude: -8.61,
        }),
        destination: expect.objectContaining({
          id: 'braga',
          label: 'Braga, Portugal',
          latitude: 41.55,
          longitude: -8.42,
        }),
      }),
    );
  });
});
