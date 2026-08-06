import type { ChangeEvent } from 'react';
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  LocationIcon,
  UsersIcon,
} from '../Icons/Icons';
import { useBookingForm } from '../../hooks/useBookingForm';
import type { BookingFormValues } from '../../types/travel';
import { timeOptions } from '../../utils/date';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void;
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const {
    values,
    errors,
    minimumDate,
    updateField,
    handleTextChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  } = useBookingForm(onSubmit);

  return (
    <form className={styles.form} id="reserva" onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.tripType}>
        <legend className="sr-only">Tipo de viagem</legend>
        <label>
          <input
            type="radio"
            name="tripType"
            value="one-way"
            checked={values.tripType === 'one-way'}
            onChange={() => updateField('tripType', 'one-way')}
          />
          <span>Ida</span>
        </label>
        <label>
          <input
            type="radio"
            name="tripType"
            value="round-trip"
            checked={values.tripType === 'round-trip'}
            onChange={() => updateField('tripType', 'round-trip')}
          />
          <span>Ida e volta</span>
        </label>
      </fieldset>

      <div className={styles.fieldGroup}>
        <label className={styles.field} htmlFor="booking-origin">
          <span className={styles.fieldIcon}><LocationIcon /></span>
          <span className={styles.fieldContent}>
            <span className={styles.fieldLabel}>Origem</span>
            <input
              id="booking-origin"
              name="origin"
              value={values.origin}
              onChange={handleTextChange('origin')}
              placeholder="Insira a localização de recolha"
              autoComplete="street-address"
              aria-invalid={Boolean(errors.origin)}
              aria-describedby={errors.origin ? 'booking-origin-error' : undefined}
            />
          </span>
        </label>
        {errors.origin ? <p className={styles.error} id="booking-origin-error">{errors.origin}</p> : null}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.field} htmlFor="booking-destination">
          <span className={styles.fieldIcon}><LocationIcon /></span>
          <span className={styles.fieldContent}>
            <span className={styles.fieldLabel}>Destino</span>
            <input
              id="booking-destination"
              name="destination"
              value={values.destination}
              onChange={handleTextChange('destination')}
              placeholder="Insira o destino"
              autoComplete="off"
              aria-invalid={Boolean(errors.destination)}
              aria-describedby={errors.destination ? 'booking-destination-error' : undefined}
            />
          </span>
        </label>
        {errors.destination ? (
          <p className={styles.error} id="booking-destination-error">{errors.destination}</p>
        ) : null}
      </div>

      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.field} htmlFor="booking-departure-date">
            <span className={styles.fieldIcon}><CalendarIcon /></span>
            <span className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Partida</span>
              <input
                id="booking-departure-date"
                name="departureDate"
                type="date"
                min={minimumDate}
                value={values.departureDate}
                onChange={handleDateChange('departureDate')}
                aria-invalid={Boolean(errors.departureDate)}
                aria-describedby={errors.departureDate ? 'booking-departure-error' : undefined}
              />
            </span>
          </label>
          {errors.departureDate ? (
            <p className={styles.error} id="booking-departure-error">{errors.departureDate}</p>
          ) : null}
        </div>

        <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-departure-time">
          <span className={styles.fieldIcon}><ClockIcon /></span>
          <span className={styles.fieldContent}>
            <span className={styles.fieldLabel}>Hora</span>
            <select
              id="booking-departure-time"
              name="departureTime"
              value={values.departureTime}
              onChange={handleTimeChange('departureTime')}
            >
              {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
          </span>
          <ChevronDownIcon />
        </label>
      </div>

      {values.tripType === 'round-trip' ? (
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label className={styles.field} htmlFor="booking-return-date">
              <span className={styles.fieldIcon}><CalendarIcon /></span>
              <span className={styles.fieldContent}>
                <span className={styles.fieldLabel}>Volta</span>
                <input
                  id="booking-return-date"
                  name="returnDate"
                  type="date"
                  min={values.departureDate || minimumDate}
                  value={values.returnDate}
                  onChange={handleDateChange('returnDate')}
                  aria-invalid={Boolean(errors.returnDate)}
                  aria-describedby={errors.returnDate ? 'booking-return-error' : undefined}
                />
              </span>
            </label>
            {errors.returnDate ? (
              <p className={styles.error} id="booking-return-error">{errors.returnDate}</p>
            ) : null}
          </div>

          <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-return-time">
            <span className={styles.fieldIcon}><ClockIcon /></span>
            <span className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Hora</span>
              <select
                id="booking-return-time"
                name="returnTime"
                value={values.returnTime}
                onChange={handleTimeChange('returnTime')}
              >
                {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </span>
            <ChevronDownIcon />
          </label>
        </div>
      ) : null}

      <div className={styles.fieldGroup}>
        <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-passengers">
          <span className={styles.fieldIcon}><UsersIcon /></span>
          <span className={styles.fieldContent}>
            <span className={styles.fieldLabel}>Passageiros</span>
            <select
              id="booking-passengers"
              name="passengers"
              value={values.passengers}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateField('passengers', Number(event.target.value))
              }
              aria-invalid={Boolean(errors.passengers)}
              aria-describedby={errors.passengers ? 'booking-passengers-error' : undefined}
            >
              {Array.from({ length: 8 }, (_, index) => index + 1).map((amount) => (
                <option key={amount} value={amount}>
                  {amount} {amount === 1 ? 'passageiro' : 'passageiros'}
                </option>
              ))}
            </select>
          </span>
          <ChevronDownIcon />
        </label>
        {errors.passengers ? (
          <p className={styles.error} id="booking-passengers-error">{errors.passengers}</p>
        ) : null}
      </div>

      <button className={styles.submitButton} type="submit">Pesquisar transfer</button>
    </form>
  );
}
