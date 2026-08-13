import { useEffect, useState } from 'react';

type StorageType = 'local' | 'session';

function getStorage(type: StorageType): Storage {
  return type === 'local' ? window.localStorage : window.sessionStorage;
}

export function useStoredState<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'session',
  deserialize: (value: unknown) => T = (value) => value as T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = getStorage(storageType).getItem(key);
      return storedValue ? deserialize(JSON.parse(storedValue) as unknown) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      getStorage(storageType).setItem(key, JSON.stringify(value));
    } catch {
      // A aplicação continua funcional quando o armazenamento está indisponível.
    }
  }, [key, storageType, value]);

  return [value, setValue] as const;
}
