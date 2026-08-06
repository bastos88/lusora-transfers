import styles from './ProgressSteps.module.css';

interface ProgressStepsProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { id: 1, label: 'Viagem' },
  { id: 2, label: 'Serviço e veículo' },
  { id: 3, label: 'Checkout' },
  { id: 4, label: 'Confirmação' },
] as const;

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <nav className={styles.wrapper} aria-label="Progresso da reserva">
      <ol>
        {steps.map((step) => {
          const isCurrent = step.id === currentStep;
          const isComplete = step.id < currentStep;

          return (
            <li
              key={step.id}
              className={`${isCurrent ? styles.current : ''} ${isComplete ? styles.complete : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.number}>{isComplete ? '✓' : step.id}</span>
              <span className={styles.label}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
