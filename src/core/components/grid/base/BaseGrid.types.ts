import { GridEvents } from '../types/GridEvents.types';
import { GridDataSourceConfig, GridCacheConfig, GridVirtualScrollConfig } from '../types/GridDataManager.types';
import { GridOptimizations } from '../types/GridOptimizations.types';
import { GridDataOperations } from '../types/GridDataOperations.types';

export interface BaseGridProps<T = any> {
  title?: string;
  columns: GridColumn[];
  data?: T[];
  loading?: boolean;
  keyField: string;
  handleError: (error: Error) => void;
  showGrouping?: boolean;
  showExport?: boolean;
  events?: GridEvents<T>;
  dataSource?: GridDataSourceConfig<T>;
  cacheConfig?: GridCacheConfig;
  virtualScrollConfig?: GridVirtualScrollConfig;
  optimizations?: Partial<GridOptimizations>;
  dataOperations?: GridDataOperations<T>;
  renderCustomHeader?: () => React.ReactNode;
  renderCustomCell?: (column: GridColumn, row: T) => React.ReactNode;
}

export interface GridColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface GridFilter {
  columnId: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}

export interface GridState {
  page: number;
  rowsPerPage: number;
  selectedRows: (string | number)[];
  searchValues: Record<string, string>;
  filterValues: Record<string, any[]>;
  sortConfig: GridSortConfig;
  visibleColumns: string[];
  groupBy: string | null;
}

export interface GridSortConfig {
  key: string;
  direction: 'asc' | 'desc';
} 