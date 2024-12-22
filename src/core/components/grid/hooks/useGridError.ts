import { useState, useCallback } from 'react';
import { GridError } from '../types/grid.types';

export const useGridError = () => {
  const [error, setError] = useState<GridError | null>(null);

  const handleError = useCallback((error: Error | GridError) => {
    if ('type' in error) {
      setError(error as GridError);
    } else {
      setError({
        type: 'API_ERROR',
        message: error.message
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}; 