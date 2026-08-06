import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { PageShell } from '../../components/PageShell/PageShell';
import { CheckIcon, LockIcon, ShieldIcon } from '../../components/Icons/Icons';
import { useAuthForm } from '../../hooks/useAuthForm';
import type { AuthMode, AuthUser, NavigateFunction } from '../../types/travel';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  user: AuthUser | null;
  onAuthenticated: (user: AuthUser) => void;
  onLogout: () => void;
  onNavigate: NavigateFunction;
}

export function AuthPage({ user, onAuthenticated, onLogout, onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const { values, errors, updateField, handleInputChange, handleSubmit } = useAuthForm(mode, onAuthenticated);

  if (user) {
    return (
      <PageShell onNavigate={onNavigate} accountLabel={`Olá, ${user.name.split(' ')[0]}`}>
        <section className={styles.accountSection}>
          <div className={styles.accountCard}>
            <span className={styles.accountIcon}><CheckIcon /></span>
            <p className={styles.eyebrow}>Área do cliente</p>
            <h1>Olá, {user.name}</h1>
            <p>Tem sessão iniciada com <strong>{user.email}</strong>. As próximas reservas poderão utilizar estes dados para agilizar o checkout.</p>
            <div className={styles.accountActions}>
              <button type="button" className={styles.primaryButton} onClick={() => onNavigate('/#reserva')}>Fazer uma reserva</button>
              <button type="button" className={styles.secondaryButton} onClick={onLogout}>Terminar sessão</button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell onNavigate={onNavigate}>
      <section className={styles.section} aria-labelledby="auth-title">
        <div className={styles.layout}>
          <aside className={styles.intro}>
            <p className={styles.eyebrow}>Área do cliente</p>
            <h1 id="auth-title">A sua viagem, organizada num só lugar.</h1>
            <p>Crie uma conta para preencher os seus dados mais rapidamente e manter a experiência de reserva simples.</p>

            <div className={styles.benefits}>
              <span><CheckIcon /> Checkout mais rápido</span>
              <span><CheckIcon /> Dados de contacto reutilizáveis</span>
              <span><CheckIcon /> Experiência preparada para histórico de reservas</span>
            </div>

            <div className={styles.securityNote}>
              <ShieldIcon />
              <span><strong>Demonstração frontend</strong> Esta versão não envia credenciais para nenhum servidor.</span>
            </div>
          </aside>

          <div className={styles.panel}>
            <div className={styles.tabs} role="tablist" aria-label="Acesso à conta">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={mode === 'login' ? styles.activeTab : ''}
                onClick={() => setMode('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={mode === 'register' ? styles.activeTab : ''}
                onClick={() => setMode('register')}
              >
                Criar conta
              </button>
            </div>

            <div className={styles.formHeader}>
              <span className={styles.formIcon}><LockIcon /></span>
              <div>
                <h2>{mode === 'login' ? 'Bem-vindo novamente' : 'Comece a viajar connosco'}</h2>
                <p>{mode === 'login' ? 'Introduza os seus dados para continuar.' : 'Preencha os dados abaixo para criar a sua conta.'}</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {mode === 'register' ? (
                <label>
                  <span>Nome completo</span>
                  <input
                    type="text"
                    value={values.name}
                    onChange={handleInputChange('name')}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'auth-name-error' : undefined}
                  />
                  {errors.name ? <small className={styles.error} id="auth-name-error">{errors.name}</small> : null}
                </label>
              ) : null}

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={values.email}
                  onChange={handleInputChange('email')}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'auth-email-error' : undefined}
                />
                {errors.email ? <small className={styles.error} id="auth-email-error">{errors.email}</small> : null}
              </label>

              {mode === 'register' ? (
                <label>
                  <span>Telefone</span>
                  <input
                    type="tel"
                    value={values.phone}
                    onChange={handleInputChange('phone')}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'auth-phone-error' : undefined}
                  />
                  {errors.phone ? <small className={styles.error} id="auth-phone-error">{errors.phone}</small> : null}
                </label>
              ) : null}

              <label>
                <span>Palavra-passe</span>
                <input
                  type="password"
                  value={values.password}
                  onChange={handleInputChange('password')}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'auth-password-error' : undefined}
                />
                {errors.password ? <small className={styles.error} id="auth-password-error">{errors.password}</small> : null}
              </label>

              {mode === 'register' ? (
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={values.acceptTerms}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('acceptTerms', event.target.checked)}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={errors.acceptTerms ? 'auth-terms-error' : undefined}
                  />
                  <span>Aceito os termos e a política de privacidade.</span>
                  {errors.acceptTerms ? <small className={styles.error} id="auth-terms-error">{errors.acceptTerms}</small> : null}
                </label>
              ) : null}

              <button className={styles.submitButton} type="submit">
                {mode === 'login' ? 'Entrar na conta' : 'Criar a minha conta'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
