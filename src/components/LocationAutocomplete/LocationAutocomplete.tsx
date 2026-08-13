import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';
import type { LocationOption } from '../../types/travel';
import { LocationIcon } from '../Icons/Icons';
import styles from './LocationAutocomplete.module.css';

interface LocationAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: LocationOption | null;
  error?: string;
  onChange: (value: LocationOption | null) => void;
}

export function LocationAutocomplete(props: LocationAutocompleteProps) {
  const { id, label, placeholder, value, error, onChange } = props;
  const [text, setText] = useState(value?.label ?? '');
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const autocomplete = useLocationAutocomplete(value ? '' : text);
  const listboxId = `${id}-suggestions`;
  const errorId = `${id}-error`;
  const statusId = `${id}-status`;
  const canOpen = autocomplete.status !== 'idle' && !value;

  useEffect(() => {
    if (value) setText(value.label);
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
    if (focused && canOpen) setOpen(true);
  }, [autocomplete.results, canOpen, focused]);

  const announcement = useMemo(() => {
    if (autocomplete.status === 'loading') return 'A pesquisar localidades.';
    if (autocomplete.status === 'error') return autocomplete.error ?? 'Erro ao pesquisar localidades.';
    if (autocomplete.status === 'success') {
      const count = autocomplete.results.length;
      return count === 0
        ? 'Nenhuma localidade encontrada.'
        : `${count} ${count === 1 ? 'localidade encontrada' : 'localidades encontradas'}.`;
    }
    return '';
  }, [autocomplete.error, autocomplete.results.length, autocomplete.status]);

  const selectOption = (option: LocationOption) => {
    setText(option.label);
    onChange(option);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    if (value) onChange(null);
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (open) event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      if (canOpen) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(event.key === 'ArrowDown' ? 0 : Math.max(autocomplete.results.length - 1, 0));
      }
      return;
    }

    if (!open || autocomplete.results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % autocomplete.results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? autocomplete.results.length - 1 : current - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(autocomplete.results.length - 1);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectOption(autocomplete.results[activeIndex]);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const keepFocus = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const activeOptionId = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;

  return (
    <div className={styles.root} onBlur={handleBlur}>
      <label className={styles.field} htmlFor={id}>
        <span className={styles.fieldIcon}>
          <LocationIcon />
        </span>
        <span className={styles.fieldContent}>
          <span className={styles.fieldLabel}>{label}</span>
          <input
            id={id}
            name={id.endsWith('origin') ? 'origin' : 'destination'}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open && canOpen}
            aria-controls={listboxId}
            aria-activedescendant={open ? activeOptionId : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={[error ? errorId : '', statusId].filter(Boolean).join(' ')}
            value={text}
            onChange={handleChange}
            onFocus={() => {
              setFocused(true);
              if (canOpen) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
          />
        </span>
      </label>

      {open && canOpen ? (
        <div className={styles.panel}>
          {autocomplete.status === 'loading' ? (
            <p className={styles.message}>A pesquisar localidades…</p>
          ) : null}
          {autocomplete.status === 'success' && autocomplete.results.length === 0 ? (
            <p className={styles.message}>Nenhuma localidade encontrada.</p>
          ) : null}
          {autocomplete.status === 'error' ? (
            <div className={styles.message}>
              <span>{autocomplete.error}</span>
              <button type="button" onMouseDown={keepFocus} onClick={autocomplete.retry}>
                Tentar novamente
              </button>
            </div>
          ) : null}
          {autocomplete.status === 'success' && autocomplete.results.length > 0 ? (
            <ul
              id={listboxId}
              className={styles.listbox}
              role="listbox"
              aria-label={`Sugestões para ${label}`}
            >
              {autocomplete.results.map((option, index) => (
                <li
                  id={`${id}-option-${index}`}
                  key={option.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? styles.activeOption : undefined}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={keepFocus}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                  >
                    <strong>{option.name}</strong>
                    <span>{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <span className="sr-only" id={statusId} role="status" aria-live="polite">
        {announcement}
      </span>
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
