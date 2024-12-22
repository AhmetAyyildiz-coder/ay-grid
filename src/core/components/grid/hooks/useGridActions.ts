import { useCallback } from 'react';
import { GridRow, GridError } from '../types/grid.types';
import { useGridError } from './useGridError.ts';
import { useGridLoading } from './useGridLoading.ts';

export const useGridActions = () => {
  const { handleError, clearError } = useGridError();
  const { setLoading } = useGridLoading();

  const handleCellEdit = useCallback(async (params: {
    rowId: string | number;
    field: string;
    value: any;
    oldValue: any;
    apiUrl: string;
  }) => {
    const { rowId, field, value, apiUrl } = params;
    
    setLoading('edit', true);
    try {
      const response = await fetch(`${apiUrl}/${rowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value })
      });

      if (!response.ok) {
        throw {
          type: 'API_ERROR',
          message: 'Güncelleme başarısız oldu',
          details: await response.json()
        } as GridError;
      }

      clearError();
      return true;
    } catch (error) {
      handleError(error as Error | GridError);
      return false;
    } finally {
      setLoading('edit', false);
    }
  }, [handleError, clearError, setLoading]);

  return { handleCellEdit };
}; 