import React from 'react';
import { GridColumn, GridState } from '../base/Grid.types';

interface GridHeaderProps {
  columns: GridColumn[];
  state: GridState;
  updateState: (updates: Partial<GridState>) => void;
  showExport: boolean;
  onExport?: () => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  state,
  updateState,
  showExport,
  onExport
}) => {
  return (
    <div className="grid-header">
      <div className="grid-header-controls">
        {showExport && (
          <button onClick={onExport} className="export-button">
            Dışa Aktar
          </button>
        )}
      </div>
      <div className="grid-header-row">
        {columns.map(column => (
          <div key={column.id} className="grid-header-cell">
            {column.label}
            {column.sortable && (
              <button
                onClick={() => updateState({
                  sortConfig: {
                    key: column.id,
                    direction: state.sortConfig.key === column.id && 
                      state.sortConfig.direction === 'asc' ? 'desc' : 'asc'
                  }
                })}
              >
                {state.sortConfig.key === column.id ? 
                  (state.sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 