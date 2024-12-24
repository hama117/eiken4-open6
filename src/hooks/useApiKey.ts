import { useState, useEffect } from 'react';
import { apiKeyStorage } from '../services/storage/apiKey';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = apiKeyStorage.get();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    apiKeyStorage.set(key);
    setApiKey(key);
  };

  const handleResetApiKey = () => {
    apiKeyStorage.remove();
    setApiKey('');
  };

  return {
    apiKey,
    setApiKey: handleSetApiKey,
    resetApiKey: handleResetApiKey,
    hasApiKey: !!apiKey
  };
}