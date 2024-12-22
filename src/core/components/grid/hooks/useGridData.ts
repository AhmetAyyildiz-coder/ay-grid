import { useMemo } from 'react';

import dayjs from 'dayjs';
import { GridColumn, GridState } from '../base/Grid.types';

interface GridDataResult {
  processedData: any[];
  groups: Record<string, any[]> | null;
  totalCount: number;
}

export const useGridData = (
  data: any[],
  columns: GridColumn[],
  state: GridState
): GridDataResult => {
  return useMemo(() => {
    let filteredData = [...data];

    // Uygula: Arama filtreleri
    if (Object.keys(state.searchValues).length) {
      filteredData = filteredData.filter(item => {
        return Object.entries(state.searchValues).every(([key, value]) => {
          if (!value || typeof value !== 'string') return true;
          const itemValue = String(item[key] || '').toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      });
    }

    // Uygula: Seçili filtreler
    if (Object.keys(state.filterValues).length) {
      filteredData = filteredData.filter(item => {
        return Object.entries(state.filterValues).every(([key, values]) => {
          if (!Array.isArray(values) || !values.length) return true;
          return values.includes(item[key]);
        });
      });
    }

    // Uygula: Sıralama
    if (state.sortConfig.key) {
      const { key, direction } = state.sortConfig;
      const column = columns.find(col => col.id === key);
      
      filteredData.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        if (column?.type === 'date') {
          aVal = dayjs(aVal);
          bVal = dayjs(bVal);
          return direction === 'asc' 
            ? aVal.diff(bVal) 
            : bVal.diff(aVal);
        }

        if (column?.type === 'number') {
          return direction === 'asc' 
            ? aVal - bVal 
            : bVal - aVal;
        }

        return direction === 'asc'
          ? String(aVal).localeCompare(String(bVal), 'tr')
          : String(bVal).localeCompare(String(aVal), 'tr');
      });
    }

    // Uygula: Gruplama
    if (state.groupBy) {
      const groups: Record<string, any[]> = {};
      filteredData.forEach(item => {
        const groupValue = item[state.groupBy!] || 'Belirtilmemiş';
        if (!groups[groupValue]) {
          groups[groupValue] = [];
        }
        groups[groupValue].push(item);
      });
      return { 
        processedData: filteredData,
        groups: groups,
        totalCount: filteredData.length
      };
    }

    return { 
      processedData: filteredData,
      groups: null,
      totalCount: filteredData.length
    };
  }, [data, columns, state]);
}; 