import { LuggageIcon, PassengerIcon } from '../Icons/Icons';
import type { Vehicle } from '../../types/travel';
import styles from './VehicleCard.module.css';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (vehicleId: string) => void;
  priceLabel?: string;
  badge?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export function VehicleCard({
  vehicle,
  isSelected,
  onSelect,
  priceLabel,
  badge,
  disabled = false,
  disabledMessage,
}: VehicleCardProps) {
  const handleVehicleClick = () => onSelect(vehicle.id);

  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      type="button"
      onClick={handleVehicleClick}
      aria-pressed={isSelected}
      disabled={disabled}
    >
      <span className={styles.imageWrap}>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
        <img
          src={vehicle.image}
          alt={`${vehicle.name} disponível para transfer`}
          width={vehicle.imageWidth}
          height={vehicle.imageHeight}
          loading="lazy"
        />
      </span>
      <span className={styles.content}>
        <span className={styles.titleRow}>
          <strong>{vehicle.name}</strong>
          {priceLabel ? <span className={styles.price}>{priceLabel}</span> : null}
        </span>
        <span className={styles.description}>{vehicle.description}</span>
        <span className={styles.meta}>
          <span><PassengerIcon /> {vehicle.passengers}</span>
          <span><LuggageIcon /> {vehicle.luggage}</span>
        </span>
        {disabledMessage ? <span className={styles.disabledMessage}>{disabledMessage}</span> : null}
      </span>
    </button>
  );
}
