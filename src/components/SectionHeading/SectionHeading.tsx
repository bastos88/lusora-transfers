import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  inverse?: boolean;
  headingId?: string;
}

export function SectionHeading({ eyebrow, title, description, inverse = false, headingId }: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${inverse ? styles.inverse : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={headingId}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
