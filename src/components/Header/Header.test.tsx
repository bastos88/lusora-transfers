import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('abre e fecha o menu mobile', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByLabelText('Abrir menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(screen.getByLabelText('Fechar menu')).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'FAQ' }));
    expect(screen.getByLabelText('Abrir menu')).toHaveAttribute('aria-expanded', 'false');
  });

  it('abre a reserva e os dados pessoais na área privada quando existe sessão', async () => {
    const user = userEvent.setup();
    const handleNavigate = vi.fn();
    render(<Header isAuthenticated accountLabel="Olá, Leonardo" onNavigate={handleNavigate} />);

    await user.click(screen.getByRole('link', { name: 'Minha reserva' }));
    expect(handleNavigate).toHaveBeenCalledWith('/minha-reserva');

    await user.click(screen.getByRole('link', { name: /Olá, Leonardo/ }));
    expect(handleNavigate).toHaveBeenCalledWith('/informacoes-pessoais');
  });
});
