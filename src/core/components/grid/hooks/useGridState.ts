import { useState, useEffect } from 'react';
import { GridState, GridColumn } from '../types/grid.types';

export const useGridState = (columns: GridColumn[], storageKey: string) => {
  const [state, setState] = useState<GridState>(() => {
    const saved = localStorage.getItem(`${storageKey}_state`);
    return saved ? JSON.parse(saved) : {
      page: 0,
      rowsPerPage: 10,
      selectedRows: [],
      searchValues: {},
      filterValues: {},
      sortConfig: { key: '', direction: 'asc' },
      visibleColumns: columns.map(col => col.id)
    };
  });

  useEffect(() => {
    localStorage.setItem(`${storageKey}_state`, JSON.stringify(state));
  }, [state, storageKey]);

  const updateState = (updates: Partial<GridState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return { state, updateState };
}; 