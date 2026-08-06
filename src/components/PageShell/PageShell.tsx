import type { ReactNode } from 'react';
import { Header } from '../Header/Header';
import { Footer } from '../../sections/Footer/Footer';
import type { NavigateFunction } from '../../types/travel';

interface PageShellProps {
  children: ReactNode;
  onNavigate: NavigateFunction;
  accountLabel?: string;
}

export function PageShell({ children, onNavigate, accountLabel }: PageShellProps) {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Saltar para o conteúdo</a>
      <Header variant="solid" onNavigate={onNavigate} accountLabel={accountLabel} />
      <main id="conteudo-principal">{children}</main>
      <Footer onNavigate={onNavigate} />
    </>
  );
}
