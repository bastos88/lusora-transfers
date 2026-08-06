import { PageShell } from '../../components/PageShell/PageShell';
import type { AuthUser, NavigateFunction } from '../../types/travel';
import styles from './NotFoundPage.module.css';

interface NotFoundPageProps {
  user: AuthUser | null;
  onNavigate: NavigateFunction;
}

export function NotFoundPage({ user, onNavigate }: NotFoundPageProps) {
  return (
    <PageShell onNavigate={onNavigate} accountLabel={user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}>
      <section className={styles.section}>
        <div>
          <p>Erro 404</p>
          <h1>Esta página não existe.</h1>
          <span>Volte ao início para pesquisar uma nova viagem.</span>
          <button type="button" onClick={() => onNavigate('/')}>Voltar ao início</button>
        </div>
      </section>
    </PageShell>
  );
}
