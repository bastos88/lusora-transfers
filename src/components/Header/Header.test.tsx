import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

describe('Header', () => {
  it('abre e fecha o menu mobile', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'FAQ' }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
