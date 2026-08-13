import type { MouseEvent } from 'react';
import logo from '../../assets/images/getting-travel-logo.png';
import { navigationItems } from '../../data/navigation';
import type { NavigateFunction } from '../../types/travel';
import styles from './Footer.module.css';

interface FooterProps {
  onNavigate?: NavigateFunction;
  isAuthenticated?: boolean;
}

export function Footer({ onNavigate, isAuthenticated = false }: FooterProps) {
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onNavigate) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.brandColumn}>
          <a
            href="/"
            aria-label="Getting Travel — voltar ao início"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNavigation(event, '/')}
          >
            <img src={logo} alt="Getting Travel" width="1100" height="330" loading="lazy" />
          </a>
          <p>Transfers privados no Porto com conforto, pontualidade e uma experiência de reserva simples.</p>
        </div>

        <div className={styles.column}>
          <h2>Navegação</h2>
          {navigationItems.map((item) => {
            const href = item.id === 'booking' && isAuthenticated ? '/minha-reserva' : `/${item.href}`;
            return (
              <a
                key={item.id}
                href={href}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNavigation(event, href)}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href={isAuthenticated ? '/informacoes-pessoais' : '/conta'}
            onClick={(event: MouseEvent<HTMLAnchorElement>) =>
              handleNavigation(event, isAuthenticated ? '/informacoes-pessoais' : '/conta')
            }
          >
            {isAuthenticated ? 'Informações pessoais' : 'Área do cliente'}
          </a>
        </div>

        <div className={styles.column}>
          <h2>Área de serviço</h2>
          <span>Porto, Portugal</span>
          <span>Aeroporto Francisco Sá Carneiro</span>
          <span>Atendimento mediante reserva</span>
        </div>

        <div className={styles.column}>
          <h2>Informação</h2>
          <span>Preços demonstrativos</span>
          <span>Pagamento no veículo</span>
          <span>Política e termos a configurar</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Getting Travel. Todos os direitos reservados.</span>
        <span>Aplicação demonstrativa em React e TypeScript.</span>
      </div>
    </footer>
  );
}
