import { ArrowRightIcon } from '../../components/Icons/Icons';
import { OrderSummary } from '../../components/OrderSummary/OrderSummary';
import { PageShell } from '../../components/PageShell/PageShell';
import { ProgressSteps } from '../../components/ProgressSteps/ProgressSteps';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { TripSummary } from '../../components/TripSummary/TripSummary';
import { VehicleCard } from '../../components/VehicleCard/VehicleCard';
import { transferServices } from '../../data/transferServices';
import { vehicles } from '../../data/vehicles';
import type { AuthUser, BookingFormValues, NavigateFunction } from '../../types/travel';
import { calculatePricing, formatCurrency } from '../../utils/pricing';
import styles from './TransfersPage.module.css';

interface TransfersPageProps {
  user: AuthUser | null;
  booking: BookingFormValues | null;
  selectedServiceId: string | null;
  selectedVehicleId: string | null;
  onServiceSelect: (serviceId: string) => void;
  onVehicleSelect: (vehicleId: string) => void;
  onContinue: () => void;
  onNavigate: NavigateFunction;
}

export function TransfersPage({
  user,
  booking,
  selectedServiceId,
  selectedVehicleId,
  onServiceSelect,
  onVehicleSelect,
  onContinue,
  onNavigate,
}: TransfersPageProps) {
  const selectedService = transferServices.find((service) => service.id === selectedServiceId);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  if (!booking) {
    return (
      <PageShell onNavigate={onNavigate} accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}>
        <section className={styles.emptyState}>
          <div>
            <p className={styles.eyebrow}>Escolha do transfer</p>
            <h1>Comece por indicar a sua viagem.</h1>
            <p>A origem, o destino e a data são necessários para apresentar os serviços e veículos disponíveis.</p>
            <button type="button" onClick={() => onNavigate('/#reserva')}>Pesquisar uma viagem</button>
          </div>
        </section>
      </PageShell>
    );
  }

  const pricing = selectedService && selectedVehicle
    ? calculatePricing(booking, selectedService, selectedVehicle)
    : null;

  return (
    <PageShell onNavigate={onNavigate} accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}>
      <section className={styles.pageHero}>
        <div>
          <p className={styles.eyebrow}>Transfer disponível</p>
          <h1>Escolha como quer viajar.</h1>
          <p>Compare os serviços, selecione a viatura adequada ao grupo e veja o preço estimado antes do checkout.</p>
        </div>
      </section>

      <ProgressSteps currentStep={2} />

      <div className={styles.content}>
        <TripSummary booking={booking} onNavigate={onNavigate} />

        <div className={styles.layout}>
          <div className={styles.options}>
            <section className={styles.optionSection} aria-labelledby="service-title">
              <div className={styles.sectionHeader}>
                <span>1</span>
                <div>
                  <p>Serviço de transfer</p>
                  <h2 id="service-title">Selecione o nível de acompanhamento</h2>
                </div>
              </div>
              <div className={styles.serviceGrid} role="radiogroup" aria-label="Serviço de transfer">
                {transferServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={service.id === selectedServiceId}
                    onSelect={onServiceSelect}
                  />
                ))}
              </div>
            </section>

            <section className={styles.optionSection} aria-labelledby="vehicle-title">
              <div className={styles.sectionHeader}>
                <span>2</span>
                <div>
                  <p>Veículo</p>
                  <h2 id="vehicle-title">Escolha a viatura para {booking.passengers} {booking.passengers === 1 ? 'passageiro' : 'passageiros'}</h2>
                </div>
              </div>
              <div className={styles.vehicleGrid}>
                {vehicles.map((vehicle) => {
                  const isUnavailable = booking.passengers > vehicle.capacity;
                  const priceLabel = vehicle.supplement === 0
                    ? 'Incluído'
                    : `+ ${formatCurrency(vehicle.supplement)}`;

                  return (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isSelected={vehicle.id === selectedVehicleId}
                      onSelect={onVehicleSelect}
                      priceLabel={priceLabel}
                      badge={vehicle.id === 'minivan-executive' && booking.passengers > 7 ? 'Recomendado' : undefined}
                      disabled={isUnavailable}
                      disabledMessage={isUnavailable ? `Capacidade máxima: ${vehicle.capacity} passageiros` : undefined}
                    />
                  );
                })}
              </div>
            </section>
          </div>

          <div className={styles.summaryColumn}>
            {selectedService && selectedVehicle && pricing ? (
              <OrderSummary
                booking={booking}
                service={selectedService}
                vehicle={selectedVehicle}
                pricing={pricing}
                action={
                  <button className={styles.continueButton} type="button" onClick={onContinue}>
                    Continuar para checkout <ArrowRightIcon />
                  </button>
                }
              />
            ) : (
              <aside className={styles.pendingSummary}>
                <p>Resumo da reserva</p>
                <h2>Falta pouco.</h2>
                <span>Selecione um serviço e uma viatura disponível para calcular o total estimado.</span>
                <div aria-hidden="true" />
                <div aria-hidden="true" />
                <div aria-hidden="true" />
              </aside>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
