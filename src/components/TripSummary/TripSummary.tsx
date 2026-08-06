import { CalendarIcon, LocationIcon, UsersIcon } from '../Icons/Icons';
import { formatBookingDate } from '../../utils/date';
import type { BookingFormValues, NavigateFunction } from '../../types/travel';
import styles from './TripSummary.module.css';

interface TripSummaryProps {
  booking: BookingFormValues;
  onNavigate: NavigateFunction;
  compact?: boolean;
}

export function TripSummary({ booking, onNavigate, compact = false }: TripSummaryProps) {
  const returnLabel = booking.tripType === 'round-trip'
    ? formatBookingDate(booking.returnDate, booking.returnTime)
    : 'Apenas ida';

  return (
    <section className={`${styles.card} ${compact ? styles.compact : ''}`} aria-labelledby="trip-summary-title">
      <div className={styles.header}>
        <div>
          <p>Resumo da viagem</p>
          <h2 id="trip-summary-title">{booking.origin} <span aria-hidden="true">→</span> {booking.destination}</h2>
        </div>
        <button type="button" onClick={() => onNavigate('/#reserva')}>Alterar</button>
      </div>

      <div className={styles.details}>
        <div>
          <LocationIcon />
          <span><strong>Recolha</strong>{booking.origin}</span>
        </div>
        <div>
          <CalendarIcon />
          <span><strong>Partida</strong>{formatBookingDate(booking.departureDate, booking.departureTime)}</span>
        </div>
        <div>
          <CalendarIcon />
          <span><strong>Volta</strong>{returnLabel}</span>
        </div>
        <div>
          <UsersIcon />
          <span><strong>Passageiros</strong>{booking.passengers}</span>
        </div>
      </div>
    </section>
  );
}
