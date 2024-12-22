import { GridColumn, GridState } from "../base/Grid.types";

export interface CellEditParams<T> {
  rowId: string | number;
  field: string;
  value: any;
  oldValue: any;
  row: T;
  columnDef: GridColumn;
}

export interface GridError extends Error {
  type: string;
  details?: any;
}

export interface GridEvents<T> {
  // Satır olayları
  onBeforeRowClick?: (row: T) => boolean | Promise<boolean>;
  onAfterRowClick?: (row: T) => void;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  onRowHover?: (row: T) => void;
  onRowSelect?: (rows: T[]) => void;

  // Hücre olayları
  onBeforeCellEdit?: (params: CellEditParams<T>) => boolean | Promise<boolean>;
  onCellEditStart?: (params: CellEditParams<T>) => void;
  onCellEditComplete?: (params: CellEditParams<T>) => void;
  onCellEditCancel?: (params: CellEditParams<T>) => void;
  onCellEdit?: (params: CellEditParams<T>) => Promise<boolean>;

  // Grid olayları
  onStateChange?: (newState: GridState) => void;
  onError?: (error: GridError) => void;
  onDataChange?: (newData: T[]) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortConfig: { field: string; direction: 'asc' | 'desc' }) => void;
  onFilterChange?: (filters: Record<string, any>) => void;

  // Özel olaylar
  onCustomAction?: (actionType: string, data?: any) => void;
} 
