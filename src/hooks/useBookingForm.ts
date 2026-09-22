import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { BookingFormErrors, BookingFormValues } from '../types/travel';
import { addDaysFromToday, buildDateTime, formatDateForInput } from '../utils/date';

const initialValues: BookingFormValues = {
  tripType: 'round-trip',
  origin: null,
  destination: null,
  departureDate: addDaysFromToday(0),
  departureTime: '10:00',
  returnDate: addDaysFromToday(4),
  returnTime: '18:00',
  passengers: 2,
};

export function validateBooking(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {};
  const departure = buildDateTime(values.departureDate, values.departureTime);
  const returnTrip = buildDateTime(values.returnDate, values.returnTime);

  if (!values.origin) {
    errors.origin = 'Indique a localização de recolha.';
  }

  if (!values.destination) {
    errors.destination = 'Indique o destino da viagem.';
  } else if (
    values.origin &&
    (values.origin.id === values.destination.id ||
      (values.origin.latitude === values.destination.latitude &&
        values.origin.longitude === values.destination.longitude))
  ) {
    errors.destination = 'O destino deve ser diferente da origem.';
  }

  if (!departure) {
    errors.departureDate = 'Selecione uma data de partida válida.';
  } else if (departure.getTime() < Date.now() - 60_000) {
    errors.departureDate = 'A partida não pode estar no passado.';
  }

  if (values.tripType === 'round-trip') {
    if (!returnTrip) {
      errors.returnDate = 'Selecione uma data de volta válida.';
    } else if (departure && returnTrip <= departure) {
      errors.returnDate = 'A volta deve acontecer depois da partida.';
    }
  }

  if (values.passengers < 1 || values.passengers > 8) {
    errors.passengers = 'Selecione entre 1 e 8 passageiros.';
  }

  return errors;
}

export function useBookingForm(
  onValidSubmit: (values: BookingFormValues) => void,
  savedValues: BookingFormValues | null = null,
) {
  const [values, setValues] = useState<BookingFormValues>(savedValues ?? initialValues);
  const [errors, setErrors] = useState<BookingFormErrors>({});

  const updateField = <K extends keyof BookingFormValues>(field: K, value: BookingFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleDateChange =
    (field: 'departureDate' | 'returnDate') => (event: ChangeEvent<HTMLInputElement>) =>
      updateField(field, event.target.value);

  const handleTimeChange =
    (field: 'departureTime' | 'returnTime') => (event: ChangeEvent<HTMLSelectElement>) =>
      updateField(field, event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateBooking(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onValidSubmit(values);
    }
  };

  return {
    values,
    errors,
    minimumDate: formatDateForInput(new Date()),
    updateField,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
}
