import type { ChangeEvent } from 'react';
import { CalendarIcon, ChevronDownIcon, ClockIcon, UsersIcon } from '../Icons/Icons';
import { useBookingForm } from '../../hooks/useBookingForm';
import type { BookingFormValues } from '../../types/travel';
import { timeOptions } from '../../utils/date';
import { LocationAutocomplete } from '../LocationAutocomplete/LocationAutocomplete';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void;
  initialValues?: BookingFormValues | null;
}

export function BookingForm({ onSubmit, initialValues = null }: BookingFormProps) {
  const { values, errors, minimumDate, updateField, handleDateChange, handleTimeChange, handleSubmit } =
    useBookingForm(onSubmit, initialValues);

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

      <LocationAutocomplete
        id="booking-origin"
        label="Origem"
        placeholder="Insira a localização de recolha"
        value={values.origin}
        error={errors.origin}
        onChange={(location) => updateField('origin', location)}
      />

      <LocationAutocomplete
        id="booking-destination"
        label="Destino"
        placeholder="Insira o destino"
        value={values.destination}
        error={errors.destination}
        onChange={(location) => updateField('destination', location)}
      />

      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.field} htmlFor="booking-departure-date">
            <span className={styles.fieldIcon}>
              <CalendarIcon />
            </span>
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
            <p className={styles.error} id="booking-departure-error">
              {errors.departureDate}
            </p>
          ) : null}
        </div>

        <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-departure-time">
          <span className={styles.fieldIcon}>
            <ClockIcon />
          </span>
          <span className={styles.fieldContent}>
            <span className={styles.fieldLabel}>Hora</span>
            <select
              id="booking-departure-time"
              name="departureTime"
              value={values.departureTime}
              onChange={handleTimeChange('departureTime')}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </span>
          <ChevronDownIcon />
        </label>
      </div>

      {values.tripType === 'round-trip' ? (
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label className={styles.field} htmlFor="booking-return-date">
              <span className={styles.fieldIcon}>
                <CalendarIcon />
              </span>
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
              <p className={styles.error} id="booking-return-error">
                {errors.returnDate}
              </p>
            ) : null}
          </div>

          <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-return-time">
            <span className={styles.fieldIcon}>
              <ClockIcon />
            </span>
            <span className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Hora</span>
              <select
                id="booking-return-time"
                name="returnTime"
                value={values.returnTime}
                onChange={handleTimeChange('returnTime')}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </span>
            <ChevronDownIcon />
          </label>
        </div>
      ) : null}

      <div className={styles.fieldGroup}>
        <label className={`${styles.field} ${styles.selectField}`} htmlFor="booking-passengers">
          <span className={styles.fieldIcon}>
            <UsersIcon />
          </span>
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
          <p className={styles.error} id="booking-passengers-error">
            {errors.passengers}
          </p>
        ) : null}
      </div>

      <label className={styles.field} htmlFor="booking-luggage">
        <span className={styles.fieldContent}><span className={styles.fieldLabel}>Malas</span>
        <select id="booking-luggage" value={values.luggage ?? 0} onChange={(event) => updateField('luggage', Number(event.target.value))}>
          {Array.from({length:8},(_,i)=><option key={i} value={i}>{i} {i===1?'mala':'malas'}</option>)}
        </select></span>
      </label>
      <p>Horários de Portugal continental.</p>
      <button className={styles.submitButton} type="submit">
        Pesquisar transfer
      </button>
    </form>
  );
}
