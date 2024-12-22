import React from 'react';
import { GridColumn } from '../base/Grid.types';

interface GridGroupingProps {
  columns: GridColumn[];
  groupBy: string | null;
  onGroupByChange: (field: string | null) => void;
}

export const GridGrouping: React.FC<GridGroupingProps> = ({
  columns,
  groupBy,
  onGroupByChange
}) => {
  return (
    <div className="grid-grouping">
      <select 
        value={groupBy || ''} 
        onChange={(e) => onGroupByChange(e.target.value || null)}
      >
        <option value="">Gruplama Yok</option>
        {columns
          .filter(col => col.groupable !== false)
          .map(col => (
            <option key={col.id} value={col.id}>
              {col.label} ile grupla
            </option>
          ))}
      </select>
    </div>
  );
}; 