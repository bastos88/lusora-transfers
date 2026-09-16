const checkIcon = '/assets/icons/check.png';
import { trustItems } from '../../data/trustItems';
import styles from './TrustBar.module.css';

export function TrustBar() {
  return (
    <section className={styles.bar} aria-label="Garantias do serviço">
      <div className={styles.inner}>
        {trustItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={checkIcon} alt="" width="96" height="96" aria-hidden="true" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
