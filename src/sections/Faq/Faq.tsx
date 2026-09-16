import { useCatalog } from '../../features/AppProvider';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import styles from './Faq.module.css';

export function Faq() {
  const { faqs } = useCatalog();
  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title">
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title="Informação para viajar com tranquilidade"
          description="Consulte as respostas essenciais antes de concluir a sua reserva."
          headingId="faq-title"
          inverse
        />
        <div className={styles.list}>
          {faqs.map((faq) => (
            <details key={faq.id} className={styles.item}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
