import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { VehicleCard } from '../../components/VehicleCard/VehicleCard';
import { vehicles } from '../../data/vehicles';
import type { Vehicle } from '../../types/travel';
import styles from './Fleet.module.css';

interface FleetProps {
  selectedVehicleId: string;
  onVehicleSelect: (vehicleId: string) => void;
}

export function Fleet({ selectedVehicleId, onVehicleSelect }: FleetProps) {
  const selectedVehicle: Vehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];

  return (
    <section className={styles.section} id="viaturas" aria-labelledby="fleet-title">
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Um veículo para cada ocasião"
          title="Escolha o conforto certo para a sua viagem"
          description="Desde o mais económico ao mais luxuoso: selecione a opção adequada ao número de passageiros e bagagem."
          headingId="fleet-title"
        />

        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={vehicle.id === selectedVehicleId}
              onSelect={onVehicleSelect}
            />
          ))}
        </div>

        <div className={styles.selection} aria-live="polite">
          <div>
            <span>Viatura selecionada</span>
            <h3>{selectedVehicle.name}</h3>
            <p>{selectedVehicle.passengers} · {selectedVehicle.luggage}</p>
          </div>
          <a href="#reserva">Reservar esta opção</a>
        </div>
      </div>
    </section>
  );
}
