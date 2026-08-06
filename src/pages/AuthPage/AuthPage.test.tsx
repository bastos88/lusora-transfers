import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AuthPage } from './AuthPage';

describe('AuthPage', () => {
  it('valida e envia o formulário de criação de conta', async () => {
    const user = userEvent.setup();
    const handleAuthenticated = vi.fn();

    render(
      <AuthPage
        user={null}
        onAuthenticated={handleAuthenticated}
        onLogout={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Nome completo'), 'Leonardo Bastos');
    await user.type(screen.getByLabelText('Email'), 'leonardo@example.com');
    await user.type(screen.getByLabelText('Telefone'), '912345678');
    await user.type(screen.getByLabelText('Palavra-passe'), 'abc123');
    await user.click(screen.getByLabelText(/Aceito os termos/));
    await user.click(screen.getByRole('button', { name: 'Criar a minha conta' }));

    expect(handleAuthenticated).toHaveBeenCalledWith({
      name: 'Leonardo Bastos',
      email: 'leonardo@example.com',
    });
  });
});
