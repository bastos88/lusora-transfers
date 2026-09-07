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
  const visibleTestimonials = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (activeIndex + offset + testimonials.length) % testimonials.length;
    return { testimonial: testimonials[index], index };
  });

  const handlePrevious = () => moveBy(-1);
  const handleNext = () => moveBy(1);

  return (
    <div className={styles.carousel} aria-roledescription="carrossel" aria-label="Avaliações de clientes">
      <div className={styles.picker}>
        <button className={styles.arrow} type="button" onClick={handlePrevious} aria-label="Avaliação anterior">
          <ArrowIcon direction="left" />
        </button>

        <div className={styles.avatarRow} role="tablist" aria-label="Escolher avaliação">
          {visibleTestimonials.map(({ testimonial, index }) => {
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
                aria-label={`Ler avaliação de ${testimonial.name}`}
                onClick={() => setActiveIndex(index)}
                title={`Ler avaliação de ${testimonial.name}`}
              >
                {testimonial.initials}
                <img
                  src={testimonial.avatar}
                  alt=""
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              </button>
            );
          })}
        </div>

        <button className={styles.arrow} type="button" onClick={handleNext} aria-label="Próxima avaliação">
          <ArrowIcon direction="right" />
        </button>
      </div>

      <article
        key={activeTestimonial.id}
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
