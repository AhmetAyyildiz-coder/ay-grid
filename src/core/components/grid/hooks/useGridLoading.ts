import { useState, useCallback } from 'react';

export const useGridLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    data: false,
    filter: false,
    sort: false,
    edit: false
  });

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return { loadingStates, setLoading, isAnyLoading };
}; 