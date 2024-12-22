import { useState, useEffect, useCallback } from 'react';
import { GridCacheConfig, GridDataSourceConfig, GridVirtualScrollConfig } from '../types/GridDataManager.types';

export const useGridDataManager = <T>(config?: {
  dataSource?: GridDataSourceConfig<T>;
  data?: T[];
  cache?: GridCacheConfig;
  virtualScroll?: GridVirtualScrollConfig;
  onError?: (error: Error) => void;
}) => {
  const [data, setData] = useState<T[]>(config?.data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!config?.dataSource?.remote) {
      setData(config?.dataSource?.local || []);
      return;
    }

    const { url, method, params, headers, transformResponse } = config.dataSource.remote;
    
    try {
      setLoading(true);
      
      // Cache kontrolü
      if (config?.cache?.enabled) {
        const cachedData = await getCachedData(config.cache.key);
        if (cachedData) {
          setData(cachedData);
          return;
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: method === 'POST' ? JSON.stringify(params) : undefined
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Veri çekme işlemi başarısız oldu');
      }

      const rawData = await response.json();
      const processedData = transformResponse ? transformResponse(rawData) : rawData;

      if (config?.cache?.enabled) {
        await setCacheData(config.cache.key, processedData, config.cache.duration);
      }

      setData(processedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [config?.dataSource?.remote?.url, config?.dataSource?.remote?.method]);

  // Cache işlemleri
  const getCachedData = async (key?: string): Promise<T[] | null> => {
    if (!key) return null;
    
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp, duration } = JSON.parse(cached);
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  };

  const setCacheData = async (key: string | undefined, data: T[], duration: number) => {
    if (!key) return;
    
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      duration
    }));
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (mounted) {
        await fetchData();
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData: fetchData
  };
}; 