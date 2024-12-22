export interface GridOptimizations {
  virtualScroll: {
    enabled: boolean;
    rowHeight: number;
    bufferSize: number;
  };
  lazyLoading: {
    enabled: boolean;
    pageSize: number;
    threshold: number;  // Kaç satır kala yeni veri yüklenecek
  };
  search: {
    debounceTime: number;
    minLength: number;
  };
  recycling: {
    enabled: boolean;
    poolSize: number;  // Yeniden kullanılacak maksimum satır sayısı
  };
  columnVirtualization: {
    enabled: boolean;
    minWidth: number;  // Minimum görünür sütun genişliği
  };
  caching: {
    enabled: boolean;
    duration: number;
    strategy: 'memory' | 'localStorage' | 'sessionStorage';
  };
}

export const defaultOptimizations: GridOptimizations = {
  virtualScroll: {
    enabled: false,
    rowHeight: 40,
    bufferSize: 10
  },
  lazyLoading: {
    enabled: false,
    pageSize: 50,
    threshold: 10
  },
  search: {
    debounceTime: 300,
    minLength: 2
  },
  recycling: {
    enabled: false,
    poolSize: 100
  },
  columnVirtualization: {
    enabled: false,
    minWidth: 100
  },
  caching: {
    enabled: false,
    duration: 5 * 60 * 1000, // 5 dakika
    strategy: 'memory'
  }
}; 