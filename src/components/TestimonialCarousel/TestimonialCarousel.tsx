import { testimonials } from '../../data/testimonials';
import { useAutoCarousel } from '../../hooks/useAutoCarousel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ArrowIcon } from '../Icons/Icons';
import styles from './TestimonialCarousel.module.css';

export function TestimonialCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const { activeIndex, setActiveIndex, moveBy } = useAutoCarousel({
    itemCount: testimonials.length,
    disabled: prefersReducedMotion,
  });
  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];

  const handlePrevious = () => moveBy(-1);
  const handleNext = () => moveBy(1);

  return (
    <div className={styles.carousel} aria-roledescription="carrossel" aria-label="Avaliações de clientes">
      <div className={styles.picker}>
        <button className={styles.arrow} type="button" onClick={handlePrevious} aria-label="Avaliação anterior">
          <ArrowIcon direction="left" />
        </button>

        <div className={styles.avatarRow} role="tablist" aria-label="Escolher avaliação">
          {testimonials.map((testimonial, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={testimonial.id}
                className={`${styles.avatar} ${isActive ? styles.activeAvatar : ''}`}
                style={{ background: testimonial.avatarBackground }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="active-testimonial"
                onClick={() => setActiveIndex(index)}
                title={`Ler avaliação de ${testimonial.name}`}
              >
                {testimonial.initials}
              </button>
            );
          })}
        </div>

        <button className={styles.arrow} type="button" onClick={handleNext} aria-label="Próxima avaliação">
          <ArrowIcon direction="right" />
        </button>
      </div>

      <article
        className={styles.review}
        id="active-testimonial"
        role="tabpanel"
        aria-live="polite"
      >
        <div className={styles.stars} aria-label="5 de 5 estrelas">★★★★★</div>
        <h3>{activeTestimonial.name} <span>| {activeTestimonial.source}</span></h3>
        <blockquote>“{activeTestimonial.text}”</blockquote>
      </article>
    </div>
  );
}
