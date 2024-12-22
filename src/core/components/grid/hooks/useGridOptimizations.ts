import { useCallback, useRef, useEffect } from 'react';
import { GridOptimizations } from '../types/GridOptimizations.types';
import debounce from 'lodash/debounce';

export const useGridOptimizations = (options: Partial<GridOptimizations>) => {
  const recycledRowsPool = useRef<HTMLElement[]>([]);
  const searchDebounceRef = useRef<any>(null);

  // Debounced arama fonksiyonu
  const debouncedSearch = useCallback(
    debounce((searchTerm: string, callback: (term: string) => void) => {
      if (searchTerm.length >= (options.search?.minLength ?? 2)) {
        callback(searchTerm);
      }
    }, options.search?.debounceTime ?? 300),
    [options.search]
  );

  // Row recycling yönetimi
  const getRecycledRow = useCallback(() => {
    if (options.recycling?.enabled && recycledRowsPool.current.length > 0) {
      return recycledRowsPool.current.pop();
    }
    return null;
  }, [options.recycling?.enabled]);

  const recycleRow = useCallback((row: HTMLElement) => {
    if (
      options.recycling?.enabled &&
      recycledRowsPool.current.length < (options.recycling?.poolSize ?? 100)
    ) {
      recycledRowsPool.current.push(row);
    }
  }, [options.recycling]);

  // Lazy loading kontrolü
  const checkLazyLoading = useCallback((
    container: HTMLElement,
    loadMore: () => void
  ) => {
    if (!options.lazyLoading?.enabled) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    const threshold = options.lazyLoading.threshold ?? 10;
    const remainingRows = Math.ceil((scrollHeight - scrollTop - clientHeight) / 40);

    if (remainingRows <= threshold) {
      loadMore();
    }
  }, [options.lazyLoading]);

  // Cache yönetimi
  const cacheManager = useCallback(<T>(key: string, data?: T): T | null => {
    if (!options.caching?.enabled) return null;

    if (data) {
      switch (options.caching.strategy) {
        case 'localStorage':
          localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
          break;
        default:
          // Memory cache implementation
          break;
      }
      return data;
    }

    // Cache'den veri okuma
    let cached = null;
    switch (options.caching?.strategy) {
      case 'localStorage':
        cached = localStorage.getItem(key);
        break;
      case 'sessionStorage':
        cached = sessionStorage.getItem(key);
        break;
    }

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp <= (options.caching.duration ?? 300000)) {
        return data;
      }
    }
    return null;
  }, [options.caching]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        searchDebounceRef.current.cancel();
      }
      recycledRowsPool.current = [];
    };
  }, []);

  return {
    debouncedSearch,
    getRecycledRow,
    recycleRow,
    checkLazyLoading,
    cacheManager
  };
}; 