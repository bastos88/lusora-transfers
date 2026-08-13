import { CalendarIcon, CheckIcon, UserIcon } from '../../components/Icons/Icons';
import { PageShell } from '../../components/PageShell/PageShell';
import { TripSummary } from '../../components/TripSummary/TripSummary';
import { transferServices } from '../../data/transferServices';
import { vehicles } from '../../data/vehicles';
import type { AuthUser, BookingConfirmation, NavigateFunction } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import styles from './CustomerAreaPage.module.css';

type CustomerAreaView = 'booking' | 'profile';

interface CustomerAreaPageProps {
  view: CustomerAreaView;
  user: AuthUser;
  confirmation: BookingConfirmation | null;
  onLogout: () => void;
  onNavigate: NavigateFunction;
}

function formatCreatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

export function CustomerAreaPage({ view, user, confirmation, onLogout, onNavigate }: CustomerAreaPageProps) {
  const service = transferServices.find((item) => item.id === confirmation?.serviceId);
  const vehicle = vehicles.find((item) => item.id === confirmation?.vehicleId);
  const hasBooking = Boolean(confirmation && service && vehicle);
  const phone = user.phone || confirmation?.customer.phone;

  return (
    <PageShell onNavigate={onNavigate} accountLabel={`Olá, ${user.name.split(' ')[0]}`} isAuthenticated>
      <section className={styles.pageHero}>
        <div>
          <p>Área do cliente</p>
          <h1>Olá, {user.name.split(' ')[0]}.</h1>
          <span>Consulte a sua reserva e mantenha os seus dados pessoais sempre à mão.</span>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav aria-label="Área do cliente">
            <button
              type="button"
              className={view === 'booking' ? styles.activeNavItem : ''}
              aria-current={view === 'booking' ? 'page' : undefined}
              onClick={() => onNavigate('/minha-reserva')}
            >
              <CalendarIcon />
              <span>
                <strong>Minha reserva</strong>
                <small>Viagem e pagamento</small>
              </span>
            </button>
            <button
              type="button"
              className={view === 'profile' ? styles.activeNavItem : ''}
              aria-current={view === 'profile' ? 'page' : undefined}
              onClick={() => onNavigate('/informacoes-pessoais')}
            >
              <UserIcon />
              <span>
                <strong>Informações pessoais</strong>
                <small>Dados da conta</small>
              </span>
            </button>
          </nav>
          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            Terminar sessão
          </button>
        </aside>

        <section
          className={styles.content}
          id="area-cliente-conteudo"
          aria-label="Conteúdo da área do cliente"
        >
          {view === 'booking' ? (
            <>
              <header className={styles.sectionHeader}>
                <div>
                  <p>A sua viagem</p>
                  <h2>Minha reserva</h2>
                </div>
                {hasBooking ? (
                  <span className={styles.status}>
                    <CheckIcon /> Confirmada
                  </span>
                ) : null}
              </header>

              {hasBooking && confirmation && service && vehicle ? (
                <div className={styles.bookingContent}>
                  <section className={styles.referenceCard} aria-label="Referência da reserva">
                    <span>Referência</span>
                    <strong>{confirmation.reference}</strong>
                    <small>Reservada em {formatCreatedAt(confirmation.createdAt)}</small>
                  </section>

                  <TripSummary
                    booking={confirmation.booking}
                    onNavigate={onNavigate}
                    compact
                    editable={false}
                  />

                  <div className={styles.detailsGrid}>
                    <section className={styles.detailCard}>
                      <p>Serviço reservado</p>
                      <h3>{service.name}</h3>
                      <dl>
                        <div>
                          <dt>Veículo</dt>
                          <dd>{vehicle.name}</dd>
                        </div>
                        <div>
                          <dt>Passageiros</dt>
                          <dd>{confirmation.booking.passengers}</dd>
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
                          <dt>Total estimado</dt>
                          <dd className={styles.total}>{formatCurrency(confirmation.total)}</dd>
                        </div>
                      </dl>
                    </section>

                    <section className={styles.detailCard}>
                      <p>Passageiro principal</p>
                      <h3>{confirmation.customer.fullName}</h3>
                      <dl>
                        <div>
                          <dt>Email</dt>
                          <dd>{confirmation.customer.email}</dd>
                        </div>
                        <div>
                          <dt>Telefone</dt>
                          <dd>{confirmation.customer.phone}</dd>
                        </div>
                        <div>
                          <dt>Voo</dt>
                          <dd>{confirmation.customer.flightNumber || 'Não indicado'}</dd>
                        </div>
                      </dl>
                    </section>
                  </div>

                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => onNavigate('/#reserva')}
                  >
                    Fazer nova reserva
                  </button>
                </div>
              ) : (
                <section className={styles.emptyState}>
                  <span className={styles.emptyIcon}>
                    <CalendarIcon />
                  </span>
                  <h3>Ainda não tem uma reserva confirmada.</h3>
                  <p>Quando concluir uma reserva, todos os detalhes da viagem ficarão disponíveis aqui.</p>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => onNavigate('/#reserva')}
                  >
                    Fazer uma reserva
                  </button>
                </section>
              )}
            </>
          ) : (
            <>
              <header className={styles.sectionHeader}>
                <div>
                  <p>A sua conta</p>
                  <h2>Informações pessoais</h2>
                </div>
              </header>

              <section className={styles.profileCard}>
                <span className={styles.avatar}>{user.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <p>Dados de contacto</p>
                  <h3>{user.name}</h3>
                </div>
                <dl>
                  <div>
                    <dt>Nome completo</dt>
                    <dd>{user.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{phone || 'Não indicado'}</dd>
                  </div>
                </dl>
              </section>

              <p className={styles.profileNote}>
                Estes dados são utilizados para agilizar o preenchimento das próximas reservas.
              </p>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
}
