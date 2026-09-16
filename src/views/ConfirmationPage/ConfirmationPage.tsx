import { CheckIcon } from '../../components/Icons/Icons';
import { PageShell } from '../../components/PageShell/PageShell';
import { ProgressSteps } from '../../components/ProgressSteps/ProgressSteps';
import { TripSummary } from '../../components/TripSummary/TripSummary';
import type { AuthUser, BookingConfirmation, NavigateFunction } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import styles from './ConfirmationPage.module.css';

interface ConfirmationPageProps {
  user: AuthUser | null;
  confirmation: BookingConfirmation | null;
  onNewBooking: () => void;
  onNavigate: NavigateFunction;
}

export function ConfirmationPage({ user, confirmation, onNewBooking, onNavigate }: ConfirmationPageProps) {
  const service = confirmation?.service;
  const vehicle = confirmation?.vehicle;

  if (!confirmation || !service || !vehicle) {
    return (
      <PageShell
        onNavigate={onNavigate}
        accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
        isAuthenticated={Boolean(user)}
      >
        <section className={styles.emptyState}>
          <div>
            <p>Confirmação</p>
            <h1>Ainda não existe uma reserva confirmada.</h1>
            <button type="button" onClick={() => onNavigate('/#reserva')}>
              Fazer uma reserva
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      onNavigate={onNavigate}
      accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
      isAuthenticated={Boolean(user)}
    >
      <ProgressSteps currentStep={4} />
      <section className={styles.section} aria-labelledby="confirmation-title">
        <div className={styles.successCard}>
          <span className={styles.successIcon}>
            <CheckIcon />
          </span>
          <p className={styles.eyebrow}>Reserva recebida</p>
          <h1 id="confirmation-title">Recebemos o seu pedido de viagem.</h1>
          <p className={styles.lead}>
            A reserva foi guardada para <strong>{confirmation.customer.email}</strong>. Guarde a referência abaixo.
          </p>
          <div className={styles.reference}>
            <span>Referência da reserva</span>
            <strong>{confirmation.reference}</strong>
          </div>
        </div>

        <div className={styles.detailsLayout}>
          <TripSummary booking={confirmation.booking} onNavigate={onNavigate} compact />
          <aside className={styles.bookingDetails}>
            <h2>Detalhes do serviço</h2>
            <dl>
              <div>
                <dt>Serviço</dt>
                <dd>{service.name}</dd>
              </div>
              <div>
                <dt>Veículo</dt>
                <dd>{vehicle.name}</dd>
              </div>
              <div>
                <dt>Passageiro</dt>
                <dd>{confirmation.customer.fullName}</dd>
              </div>
              <div>
                <dt>Pagamento</dt>
                <dd>
                  {confirmation.customer.paymentMethod === 'cash'
                    ? 'Dinheiro no veículo'
                    : 'Cartão no veículo'}
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd className={styles.total}>{formatCurrency(confirmation.total)}</dd>
              </div>
            </dl>
            <p>Estado: {confirmation.statusLabel}. Pagamento: {confirmation.paymentStatusLabel}. Pode acompanhar a reserva na sua conta.</p>
          </aside>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={onNewBooking}>
            Fazer nova reserva
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => onNavigate('/')}>
            Voltar ao início
          </button>
        </div>
      </section>
    </PageShell>
  );
}
