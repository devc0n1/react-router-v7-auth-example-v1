// Custom hooks for API calls with loading states and error handling

import { useState, useEffect, useCallback } from 'react';

// Generic API state interface
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook for async API calls with loading states
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  return { ...state, refetch };
}

// Hook for API calls that can be triggered manually
export function useAsyncCallback<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
): [(...args: Args) => Promise<void>, ApiState<T>] {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: Args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction(...args);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
      // Re-throw error so caller can handle it
      throw error;
    }
  }, [asyncFunction]);

  return [execute, state];
}

// Hook for list data with CRUD operations
export function useApiList<T extends { id: string }>(
  fetchFunction: () => Promise<T[]>
): {
  items: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
} {
  const { data: items, loading, error, refetch } = useAsync(fetchFunction);

  const addItem = useCallback((_item: T) => {
    // Optimistically add item to the list
    // In a real app, you'd call the API first, then update local state
  }, []);

  const updateItem = useCallback((_id: string, _updates: Partial<T>) => {
    // Optimistically update item in the list
    // In a real app, you'd call the API first, then update local state
  }, []);

  const removeItem = useCallback((_id: string) => {
    // Optimistically remove item from the list
    // In a real app, you'd call the API first, then update local state
  }, []);

  return {
    items: items || [],
    loading,
    error,
    refetch,
    addItem,
    updateItem,
    removeItem,
  };
}

// Hook for pagination
export function usePagination<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[]; pagination: any }>,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const { data, loading, error, refetch } = useAsync(
    () => fetchFunction(page, limit),
    [page, limit]
  );

  const nextPage = useCallback(() => {
    if (data?.pagination.page < data?.pagination.totalPages) {
      setPage(prev => prev + 1);
    }
  }, [data?.pagination]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    items: data?.data || [],
    pagination: data?.pagination || null,
    loading,
    error,
    refetch,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    currentPage: page,
    currentLimit: limit,
  };
}

// Hook for debounced API calls (useful for search)
export function useDebounced<T>(
  asyncFunction: (query: string) => Promise<T>,
  delay: number = 300
): [
  (query: string) => void,
  ApiState<T>
] {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Execute API call when debounced query changes
  const { data, loading, error } = useAsync(
    () => debouncedQuery ? asyncFunction(debouncedQuery) : Promise.resolve(null as T),
    [debouncedQuery]
  );

  return [setQuery, { data, loading, error }];
}

// Hook for optimistic updates
export function useOptimisticUpdate<T extends { id: string }>(
  items: T[],
  updateFunction: (item: T) => Promise<T>
): [T[], (item: T) => Promise<void>] {
  const [optimisticItems, setOptimisticItems] = useState(items);

  // Update optimistic items when items prop changes
  useEffect(() => {
    setOptimisticItems(items);
  }, [items]);

  const performOptimisticUpdate = useCallback(async (updatedItem: T) => {
    // Optimistically update the local state
    setOptimisticItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );

    try {
      // Perform the actual API call
      await updateFunction(updatedItem);
    } catch (error) {
      // Revert the optimistic update on error
      setOptimisticItems(items);
      throw error;
    }
  }, [items, updateFunction]);

  return [optimisticItems, performOptimisticUpdate];
}