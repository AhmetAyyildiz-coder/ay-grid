import React from 'react';
import { GridState } from '../base/Grid.types';

interface GridPaginationProps {
  total: number;
  state: GridState;
  updateState: (updates: Partial<GridState>) => void;
}

export const GridPagination: React.FC<GridPaginationProps> = ({
  total,
  state,
  updateState
}) => {
  const totalPages = Math.ceil(total / state.rowsPerPage);
  
  return (
    <div className="grid-pagination">
      <button
        disabled={state.page === 0}
        onClick={() => updateState({ page: state.page - 1 })}
      >
        Önceki
      </button>
      
      <span>
        Sayfa {state.page + 1} / {totalPages}
      </span>
      
      <button
        disabled={state.page >= totalPages - 1}
        onClick={() => updateState({ page: state.page + 1 })}
      >
        Sonraki
      </button>
      
      <select
        value={state.rowsPerPage}
        onChange={(e) => updateState({ 
          rowsPerPage: Number(e.target.value),
          page: 0
        })}
      >
        {[10, 25, 50, 100].map(size => (
          <option key={size} value={size}>
            {size} satır
          </option>
        ))}
      </select>
    </div>
  );
}; 