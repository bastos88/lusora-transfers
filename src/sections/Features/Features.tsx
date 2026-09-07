import { FeatureCard } from '../../components/FeatureCard/FeatureCard';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { features } from '../../data/features';
import styles from './Features.module.css';

export function Features() {
  return (
    <section className={styles.section} id="vantagens" aria-labelledby="features-title">
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Por que escolher a Lusóra Tranfers?"
          title="O seu transfer, pensado do início ao fim"
          description="Uma experiência simples, confortável e preparada para a sua chegada ao Porto."
          headingId="features-title"
          inverse
        />
        <div className={styles.grid}>
          {features.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
        </div>
      </div>
    </section>
  );
}
