import type { CSSProperties } from 'react';
const heroImage = '/assets/images/porto-hero.webp';
import type { AuthUser, BookingFormValues, NavigateFunction } from '../../types/travel';
import { BookingForm } from '../../components/BookingForm/BookingForm';
import { Header } from '../../components/Header/Header';
import styles from './Hero.module.css';

interface HeroProps {
  onBookingSubmit: (values: BookingFormValues) => void;
  booking: BookingFormValues | null;
  onNavigate: NavigateFunction;
  user: AuthUser | null;
}

export function Hero({ onBookingSubmit, booking, onNavigate, user }: HeroProps) {
  return (
    <section
      className={styles.hero}
      id="inicio"
      style={{ '--hero-image': `url(${heroImage})` } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <Header
        onNavigate={onNavigate}
        accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
        isAuthenticated={Boolean(user)}
      />
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Transfer privado · Porto</p>
          <h1 id="hero-title">Reserve já a sua viagem!</h1>
          <p className={styles.description}>
            Transfers confortáveis de e para o Aeroporto do Porto, com recolha à hora combinada e serviço
            porta a porta.
          </p>
          <a className={styles.cta} href="#reserva">
            Fazer uma reserva
          </a>
        </div>
        <BookingForm onSubmit={onBookingSubmit} initialValues={booking} />
      </div>
    </section>
  );
}
