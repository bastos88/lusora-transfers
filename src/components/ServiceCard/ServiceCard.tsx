import { CheckIcon, ClockIcon } from '../Icons/Icons';
import { formatCurrency } from '../../utils/pricing';
import type { TransferService } from '../../types/travel';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: TransferService;
  isSelected: boolean;
  onSelect: (serviceId: string) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <label className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      <input
        className="sr-only"
        type="radio"
        name="transfer-service"
        value={service.id}
        checked={isSelected}
        onChange={() => onSelect(service.id)}
      />
      {service.badge ? <span className={styles.badge}>{service.badge}</span> : null}
      <span className={styles.topline}>
        <span>
          <strong>{service.name}</strong>
          <small>{service.description}</small>
        </span>
        <span className={styles.price}>
          desde <strong>{formatCurrency(service.basePrice)}</strong>
          <small>por trajeto</small>
        </span>
      </span>
      <span className={styles.duration}><ClockIcon /> {service.duration}</span>
      <span className={styles.includes}>
        {service.includes.map((item) => (
          <span key={item}><CheckIcon /> {item}</span>
        ))}
      </span>
      <span className={styles.selectText}>{isSelected ? 'Serviço selecionado' : 'Selecionar serviço'}</span>
    </label>
  );
}
