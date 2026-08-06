import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Fleet } from './Fleet';

describe('Fleet', () => {
  it('renderiza as viaturas com chaves e permite selecionar uma opção', async () => {
    const user = userEvent.setup();
    const handleVehicleSelect = vi.fn();
    render(<Fleet selectedVehicleId="standard" onVehicleSelect={handleVehicleSelect} />);

    expect(screen.getByRole('button', { name: /Standard/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('button')).toHaveLength(4);

    await user.click(screen.getByRole('button', { name: /Executivo/ }));
    expect(handleVehicleSelect).toHaveBeenCalledWith('executive');
  });
});
