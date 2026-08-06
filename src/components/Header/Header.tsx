import type { MouseEvent } from 'react';
import logo from '../../assets/images/getting-travel-logo.png';
import { navigationItems } from '../../data/navigation';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import type { NavigateFunction } from '../../types/travel';
import { UserIcon } from '../Icons/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  variant?: 'overlay' | 'solid';
  onNavigate?: NavigateFunction;
  accountLabel?: string;
}

export function Header({ variant = 'overlay', onNavigate, accountLabel = 'Entrar' }: HeaderProps) {
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
          aria-label="Getting Travel — página inicial"
          onClick={(event: MouseEvent<HTMLAnchorElement>) => handleInternalNavigation(event, '/')}
        >
          <img src={logo} alt="Getting Travel" width="1100" height="330" />
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
            const href = `/${item.href}`;

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
            href="/conta"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => handleInternalNavigation(event, '/conta')}
          >
            <UserIcon />
            <span>{accountLabel}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
