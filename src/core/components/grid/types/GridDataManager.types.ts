export interface GridDataSourceConfig<T> {
  local?: T[];
  remote?: {
    url: string;
    method: 'GET' | 'POST';
    params?: Record<string, any>;
    headers?: Record<string, string>;
    transformResponse?: (response: any) => T[];
  };
}

export interface GridCacheConfig {
  enabled: boolean;
  duration: number;  // milliseconds
  key?: string;
}

export interface GridVirtualScrollConfig {
  enabled: boolean;
  rowHeight: number;
  bufferSize: number;  // Görünen alan dışında tutulacak satır sayısı
}

export interface GridDataManager<T> {
  dataSource: GridDataSourceConfig<T>;
  cache?: GridCacheConfig;
  virtualScroll?: GridVirtualScrollConfig;
} 