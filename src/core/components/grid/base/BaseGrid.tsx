import React, { useState, useCallback } from 'react';
import { BaseGridProps, GridFilter } from './BaseGrid.types';
import debounce from 'lodash/debounce';

import { useGridDataManager } from '../hooks/useGridDataManager';

import './BaseGrid.css';

export function BaseGrid<T>({ ...props }: BaseGridProps<T>) {
  const [filters, setFilters] = useState<GridFilter[]>([]);
  const { data, loading, error } = useGridDataManager(props);

  const debouncedFilter = useCallback(
    debounce((columnId: string, value: string) => {
      setFilters(prev => {
        const existing = prev.find(f => f.columnId === columnId);
        if (!value) {
          return prev.filter(f => f.columnId !== columnId);
        }
        if (existing) {
          return prev.map(f => f.columnId === columnId ? { ...f, value } : f);
        }
        return [...prev, { columnId, value, operator: 'contains' }];
      });
    }, 300),
    []
  );

  const handleFilterChange = (columnId: string, value: string) => {
    debouncedFilter(columnId, value);
  };

  const filteredData = React.useMemo(() => {
    if (filters.length === 0) return data;
    
    return data.filter(row => {
      return filters.every(filter => {
        const cellValue = String((row as Record<string, any>)[filter.columnId]).toLowerCase();
        const searchValue = filter.value.toLowerCase();
        
        switch (filter.operator) {
          case 'contains':
            return cellValue.includes(searchValue);
          case 'equals':
            return cellValue === searchValue;
          case 'startsWith':
            return cellValue.startsWith(searchValue);
          case 'endsWith':
            return cellValue.endsWith(searchValue);
          default:
            return cellValue.includes(searchValue);
        }
      });
    });
  }, [data, filters]);

  return (
    <div className="base-grid">
      {props.title && (
        <div className="base-grid-header">
          <h2>{props.title}</h2>
        </div>
      )}
      <table className="base-grid-table">
        <thead>
          <tr>
            {props.columns.map(column => (
              <th key={column.id}>
                <div className="column-header">
                  <div className="header-content">
                    <span>{column.label}</span>
                  </div>
                  <div className="filter-container">
                    <input
                      type="text"
                      className="filter-input"
                      placeholder={`${column.label} ara...`}
                      onChange={(e) => handleFilterChange(column.id, e.target.value)}
                    />
                    <span className="filter-icon">🔍</span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row: any) => (
            <tr key={row[props.keyField]}>
              {props.columns.map(column => (
                <td key={column.id} style={{ width: column.width }}>
                  {props.renderCustomCell?.(column, row) || row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 