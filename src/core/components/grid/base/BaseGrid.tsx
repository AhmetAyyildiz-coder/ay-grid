import React, { useState } from 'react';
import { BaseGridProps, GridFilter } from './BaseGrid.types';

import { useGridDataManager } from '../hooks/useGridDataManager';

import './BaseGrid.css';

export function BaseGrid<T>({ ...props }: BaseGridProps<T>) {
  const [filters, setFilters] = useState<GridFilter[]>([]);
  const { data, loading, error } = useGridDataManager(props);

  const handleFilterChange = (columnId: string, value: string) => {
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
  };

  const filteredData = React.useMemo(() => {
    return data.filter(row => {
      return filters.every(filter => {
        const value = String((row as Record<string, any>)[filter.columnId]).toLowerCase();
        const searchValue = filter.value.toLowerCase();
        return value.includes(searchValue);
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
                  <span>{column.label}</span>
                  {column.filterable && (
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Filtrele..."
                      onChange={(e) => handleFilterChange(column.id, e.target.value)}
                    />
                  )}
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