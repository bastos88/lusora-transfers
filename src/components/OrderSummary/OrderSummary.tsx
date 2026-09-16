import type { ReactNode } from 'react';
import { ShieldIcon } from '../Icons/Icons';
import type { BookingFormValues, PricingBreakdown, TransferService, Vehicle } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
  booking: BookingFormValues;
  service: TransferService;
  vehicle: Vehicle;
  pricing: PricingBreakdown;
  action?: ReactNode;
}

export function OrderSummary({ booking, service, vehicle, pricing, action }: OrderSummaryProps) {
  return (
    <aside className={styles.card} aria-labelledby="order-summary-title">
      <p className={styles.eyebrow}>A sua escolha</p>
      <h2 id="order-summary-title">Resumo da reserva</h2>

      <dl className={styles.items}>
        <div>
          <dt>Serviço</dt>
          <dd>{service.shortName}</dd>
        </div>
        <div>
          <dt>Veículo</dt>
          <dd>{vehicle.name}</dd>
        </div>
        <div>
          <dt>Viagem</dt>
          <dd>{booking.tripType === 'round-trip' ? 'Ida e volta' : 'Apenas ida'}</dd>
        </div>
        <div>
          <dt>Passageiros</dt>
          <dd>{booking.passengers}</dd>
        </div>
      </dl>

      <div className={styles.priceLines}>
        <div><span>Serviço por trajeto</span><strong>{formatCurrency(pricing.servicePrice)}</strong></div>
        <div><span>Suplemento da viatura</span><strong>{formatCurrency(pricing.vehicleSupplement)}</strong></div>
        <div><span>Número de trajetos</span><strong>× {pricing.journeys}</strong></div>
      </div>

      <div className={styles.total}>
        <span>Total estimado</span>
        <strong>{formatCurrency(pricing.total)}</strong>
      </div>

      <p className={styles.note}>O preço final é calculado no checkout. Cancelamento gratuito até 24 horas antes da recolha.</p>
      <div className={styles.secure}><ShieldIcon /> Reserva segura e cancelamento conforme as condições do serviço.</div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </aside>
  );
}
