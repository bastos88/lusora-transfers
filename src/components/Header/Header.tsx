import type { MouseEvent } from 'react';
import logo from '../../assets/images/luso-logo.png';
import { navigationItems } from '../../data/navigation';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import type { NavigateFunction } from '../../types/travel';
import { UserIcon } from '../Icons/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  variant?: 'overlay' | 'solid';
  onNavigate?: NavigateFunction;
  accountLabel?: string;
  isAuthenticated?: boolean;
}

export function Header({
  variant = 'overlay',
  onNavigate,
  accountLabel = 'Entrar',
  isAuthenticated = false,
}: HeaderProps) {
  const { isOpen, handleMenuToggle, handleMenuClose } = useMobileMenu();

  const handleInternalNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    handleMenuClose();

    if (!onNavigate) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  return (
    <header className={`${styles.header} ${variant === 'solid' ? styles.solid : ''}`}>
      <div className={styles.inner}>
        <a
          className={styles.brand}
          href="/"
          aria-label="Lusóra Tranfers — página inicial"
          onClick={(event: MouseEvent<HTMLAnchorElement>) => handleInternalNavigation(event, '/')}
        >
          <img src={logo} alt="Lusóra Tranfers" width="1774" height="887" />
        </a>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={handleMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ''}`}
          aria-label="Navegação principal"
        >
          {navigationItems.map((item) => {
            const href = item.id === 'booking' && isAuthenticated ? '/minha-reserva' : `/${item.href}`;

            return (
              <a
                key={item.id}
                href={href}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => handleInternalNavigation(event, href)}
              >
                {item.label}
              </a>
            );
          })}
          <a
            className={styles.accountLink}
            href={isAuthenticated ? '/informacoes-pessoais' : '/conta'}
            onClick={(event: MouseEvent<HTMLAnchorElement>) =>
              handleInternalNavigation(event, isAuthenticated ? '/informacoes-pessoais' : '/conta')
            }
          >
            <UserIcon />
            <span>{accountLabel}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
