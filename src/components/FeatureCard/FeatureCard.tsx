import type { Feature } from '../../types/travel';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>
        <img
          src={feature.icon}
          alt=""
          width={feature.iconWidth}
          height={feature.iconHeight}
          loading="lazy"
          aria-hidden="true"
        />
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </article>
  );
}
