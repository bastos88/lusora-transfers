import { api, json, ApiError } from '../services/api';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { AuthMode, AuthUser } from '../types/travel';

interface AuthFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
}

type AuthField = keyof AuthFormValues;
type AuthFormErrors = Partial<Record<AuthField, string>>;

const initialValues: AuthFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  acceptTerms: false,
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: AuthFormValues, mode: AuthMode): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (mode === 'register' && values.name.trim().length < 2) {
    errors.name = 'Indique o seu nome completo.';
  }

  if (!isValidEmail(values.email.trim())) {
    errors.email = 'Introduza um endereço de email válido.';
  }

  if (mode === 'register' && values.phone.trim().length < 8) {
    errors.phone = 'Introduza um número de telefone válido.';
  }

  if ((mode === 'register' && values.password.length < 8) || (mode === 'login' && !values.password)) {
    errors.password = 'A palavra-passe deve ter pelo menos 8 caracteres.';
  }

  if (mode === 'register' && !values.acceptTerms) {
    errors.acceptTerms = 'Aceite os termos para criar a conta.';
  }

  return errors;
}

export function useAuthForm(mode: AuthMode, onAuthenticated: (user: AuthUser) => void) {
  const [values, setValues] = useState<AuthFormValues>(initialValues);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');

  useEffect(() => {
    setErrors({});
  }, [mode]);

  const updateField = <K extends AuthField>(field: K, value: AuthFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleInputChange =
    (field: Exclude<AuthField, 'acceptTerms'>) => (event: ChangeEvent<HTMLInputElement>) =>
      updateField(field, event.target.value);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validate(values, mode);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);setSubmitError('');
    try {
      const result=await api<{data:AuthUser}>(mode==='register'?'/register':'/login',{method:'POST',body:json({
        name:values.name.trim(),email:values.email.trim(),phone:values.phone.trim(),
        password:values.password,password_confirmation:values.password,accept_terms:values.acceptTerms,
      })});
      setValues(initialValues);onAuthenticated(result.data);
    } catch(e) {
      setSubmitError(e instanceof Error?e.message:'Não foi possível iniciar sessão.');
      if(e instanceof ApiError) setErrors(Object.fromEntries(Object.entries(e.errors).map(([key,messages])=>[key,messages[0]])));
    } finally {setIsSubmitting(false);}
  };

  return { values, errors, isSubmitting, submitError, updateField, handleInputChange, handleSubmit };
}
