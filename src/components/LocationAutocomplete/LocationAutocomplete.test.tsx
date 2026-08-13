import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';
import type { LocationOption } from '../../types/travel';
import { LocationAutocomplete } from './LocationAutocomplete';

vi.mock('../../hooks/useLocationAutocomplete', () => ({ useLocationAutocomplete: vi.fn() }));

const porto: LocationOption = {
  id: 'porto',
  label: 'Porto, Portugal',
  name: 'Porto',
  city: 'Porto',
  country: 'Portugal',
  countryCode: 'PT',
  latitude: 41.15,
  longitude: -8.61,
};
const braga: LocationOption = {
  id: 'braga',
  label: 'Braga, Portugal',
  name: 'Braga',
  city: 'Braga',
  country: 'Portugal',
  countryCode: 'PT',
  latitude: 41.55,
  longitude: -8.42,
};
const retry = vi.fn();

function setAutocomplete(
  status: 'idle' | 'loading' | 'success' | 'error',
  results: LocationOption[] = [],
  error: string | null = null,
) {
  vi.mocked(useLocationAutocomplete).mockReturnValue({ status, results, error, retry });
}

describe('LocationAutocomplete', () => {
  beforeEach(() => {
    retry.mockReset();
    setAutocomplete('success', [porto, braga]);
  });

  it('mantém o foco, navega por teclado e seleciona com Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={null}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Origem' });
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith(braga);
    expect(input).toHaveFocus();
  });

  it('seleciona por clique e limpa a seleção quando o texto é editado', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={null}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Origem' }));
    await user.click(screen.getByRole('button', { name: /Porto.*Porto, Portugal/ }));
    expect(onChange).toHaveBeenCalledWith(porto);

    rerender(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={porto}
        onChange={onChange}
      />,
    );
    await user.type(screen.getByRole('combobox', { name: 'Origem' }), ' editado');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('mostra loading, vazio e erro com retry', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setAutocomplete('loading');
    const { rerender } = render(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={null}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('A pesquisar localidades…')).toBeVisible();

    setAutocomplete('success');
    rerender(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={null}
        onChange={onChange}
      />,
    );
    expect(screen.getAllByText('Nenhuma localidade encontrada.')[0]).toBeVisible();

    setAutocomplete('error', [], 'Serviço indisponível.');
    rerender(
      <LocationAutocomplete
        id="origin"
        label="Origem"
        placeholder="Pesquisar"
        value={null}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
