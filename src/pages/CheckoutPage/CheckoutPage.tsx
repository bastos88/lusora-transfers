import type { ChangeEvent } from 'react';
import { CardIcon, LockIcon } from '../../components/Icons/Icons';
import { OrderSummary } from '../../components/OrderSummary/OrderSummary';
import { PageShell } from '../../components/PageShell/PageShell';
import { ProgressSteps } from '../../components/ProgressSteps/ProgressSteps';
import { TripSummary } from '../../components/TripSummary/TripSummary';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import type {
  AuthUser,
  BookingFormValues,
  CheckoutFormValues,
  NavigateFunction,
  TransferService,
  Vehicle,
} from '../../types/travel';
import { calculatePricing, formatCurrency } from '../../utils/pricing';
import styles from './CheckoutPage.module.css';

interface CheckoutPageProps {
  user: AuthUser | null;
  booking: BookingFormValues | null;
  service: TransferService | null;
  vehicle: Vehicle | null;
  onSubmit: (values: CheckoutFormValues) => void;
  onNavigate: NavigateFunction;
}

export function CheckoutPage({ user, booking, service, vehicle, onSubmit, onNavigate }: CheckoutPageProps) {
  const {
    values,
    errors,
    isSubmitting,
    updateField,
    handleInputChange,
    handleNotesChange,
    handleSubmit,
  } = useCheckoutForm(user, onSubmit);

  if (!booking || !service || !vehicle) {
    return (
      <PageShell onNavigate={onNavigate} accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}>
        <section className={styles.emptyState}>
          <div>
            <p>Checkout</p>
            <h1>A sua seleção ainda não está completa.</h1>
            <span>Escolha primeiro o serviço e a viatura para avançar para o checkout.</span>
            <button type="button" onClick={() => onNavigate(booking ? '/transfers' : '/#reserva')}>
              {booking ? 'Voltar aos transfers' : 'Pesquisar uma viagem'}
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  const pricing = calculatePricing(booking, service, vehicle);

  return (
    <PageShell onNavigate={onNavigate} accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}>
      <section className={styles.pageHero}>
        <div>
          <p>Checkout seguro</p>
          <h1>Confirme os dados da reserva.</h1>
          <span>Não será efetuada qualquer cobrança online nesta versão demonstrativa.</span>
        </div>
      </section>

      <ProgressSteps currentStep={3} />

      <div className={styles.content}>
        <TripSummary booking={booking} onNavigate={onNavigate} compact />

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <section className={styles.formSection} aria-labelledby="contact-title">
              <div className={styles.sectionHeading}>
                <span>1</span>
                <div>
                  <p>Passageiro principal</p>
                  <h2 id="contact-title">Dados de contacto</h2>
                </div>
              </div>

              {!user ? (
                <div className={styles.loginPrompt}>
                  <span>Já tem conta? Entre para preencher os dados mais rapidamente.</span>
                  <button type="button" onClick={() => onNavigate('/conta')}>Entrar</button>
                </div>
              ) : null}

              <div className={styles.fieldsGrid}>
                <label className={styles.fullWidth}>
                  <span>Nome completo *</span>
                  <input
                    type="text"
                    value={values.fullName}
                    onChange={handleInputChange('fullName')}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'checkout-name-error' : undefined}
                  />
                  {errors.fullName ? <small className={styles.error} id="checkout-name-error">{errors.fullName}</small> : null}
                </label>

                <label>
                  <span>Email *</span>
                  <input
                    type="email"
                    value={values.email}
                    onChange={handleInputChange('email')}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  />
                  {errors.email ? <small className={styles.error} id="checkout-email-error">{errors.email}</small> : null}
                </label>

                <label>
                  <span>Telefone *</span>
                  <input
                    type="tel"
                    value={values.phone}
                    onChange={handleInputChange('phone')}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                  />
                  {errors.phone ? <small className={styles.error} id="checkout-phone-error">{errors.phone}</small> : null}
                </label>

                <label className={styles.fullWidth}>
                  <span>Número do voo <small>(opcional)</small></span>
                  <input
                    type="text"
                    value={values.flightNumber}
                    onChange={handleInputChange('flightNumber')}
                    placeholder="Ex.: TP1928"
                    autoComplete="off"
                  />
                </label>

                <label className={styles.fullWidth}>
                  <span>Observações <small>(opcional)</small></span>
                  <textarea
                    value={values.notes}
                    onChange={handleNotesChange}
                    rows={4}
                    placeholder="Cadeira de criança, mobilidade reduzida ou outra informação importante."
                  />
                </label>
              </div>
            </section>

            <section className={styles.formSection} aria-labelledby="payment-title">
              <div className={styles.sectionHeading}>
                <span>2</span>
                <div>
                  <p>Forma de pagamento</p>
                  <h2 id="payment-title">Pague no momento da viagem</h2>
                </div>
              </div>

              <div className={styles.paymentOptions}>
                <label className={values.paymentMethod === 'card-on-arrival' ? styles.selectedPayment : ''}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card-on-arrival"
                    checked={values.paymentMethod === 'card-on-arrival'}
                    onChange={() => updateField('paymentMethod', 'card-on-arrival')}
                  />
                  <CardIcon />
                  <span><strong>Cartão no veículo</strong><small>Pagamento diretamente ao motorista.</small></span>
                </label>
                <label className={values.paymentMethod === 'cash' ? styles.selectedPayment : ''}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={values.paymentMethod === 'cash'}
                    onChange={() => updateField('paymentMethod', 'cash')}
                  />
                  <span className={styles.euroIcon} aria-hidden="true">€</span>
                  <span><strong>Dinheiro</strong><small>Pagamento em numerário no final da viagem.</small></span>
                </label>
              </div>

              <label className={styles.terms}>
                <input
                  type="checkbox"
                  checked={values.acceptTerms}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('acceptTerms', event.target.checked)}
                  aria-invalid={Boolean(errors.acceptTerms)}
                  aria-describedby={errors.acceptTerms ? 'checkout-terms-error' : undefined}
                />
                <span>Confirmo que os dados estão corretos e aceito os termos e condições da reserva.</span>
                {errors.acceptTerms ? <small className={styles.error} id="checkout-terms-error">{errors.acceptTerms}</small> : null}
              </label>

              <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                <LockIcon /> {isSubmitting ? 'A confirmar…' : `Confirmar reserva — ${formatCurrency(pricing.total)}`}
              </button>
              <p className={styles.demoNote}>Checkout demonstrativo: nenhum dado de pagamento é recolhido ou processado.</p>
            </section>
          </form>

          <div className={styles.summaryColumn}>
            <OrderSummary booking={booking} service={service} vehicle={vehicle} pricing={pricing} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
