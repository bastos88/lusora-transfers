import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type {
  AuthUser,
  CheckoutFormErrors,
  CheckoutFormValues,
} from '../types/travel';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Indique o nome do passageiro principal.';
  }

  if (!isValidEmail(values.email.trim())) {
    errors.email = 'Introduza um email válido para receber a confirmação.';
  }

  if (values.phone.trim().length < 8) {
    errors.phone = 'Introduza um número de telefone válido.';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'Aceite os termos para confirmar a reserva.';
  }

  return errors;
}

export function useCheckoutForm(
  user: AuthUser | null,
  onValidSubmit: (values: CheckoutFormValues) => void,
) {
  const [values, setValues] = useState<CheckoutFormValues>(() => ({
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    flightNumber: '',
    notes: '',
    paymentMethod: 'card-on-arrival',
    acceptTerms: false,
  }));
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CheckoutFormValues>(
    field: K,
    value: CheckoutFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleInputChange =
    (field: 'fullName' | 'email' | 'phone' | 'flightNumber') =>
    (event: ChangeEvent<HTMLInputElement>) =>
      updateField(field, event.target.value);

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateField('notes', event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    onValidSubmit(values);
  };

  return {
    values,
    errors,
    isSubmitting,
    updateField,
    handleInputChange,
    handleNotesChange,
    handleSubmit,
  };
}
