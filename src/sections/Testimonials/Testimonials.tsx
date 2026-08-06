import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { TestimonialCarousel } from '../../components/TestimonialCarousel/TestimonialCarousel';
import styles from './Testimonials.module.css';

export function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="O que dizem sobre nós?"
          title="Experiências que começam bem"
          description="Conforto, pontualidade e atenção aos detalhes em cada percurso."
          headingId="testimonials-title"
        />
        <TestimonialCarousel />
      </div>
    </section>
  );
}
