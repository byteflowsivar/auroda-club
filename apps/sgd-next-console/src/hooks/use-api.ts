import { useCallback, useState } from 'react';
import { useErrorHandler } from '@/lib/error-handler';
import type { PaginationInfo } from '@/types';

// Estado para operaciones async
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Hook para manejar operaciones de API
export function useApi<T>() {
  const [ state, setState ] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleError, showSuccess } = useErrorHandler();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      successMessage?: string;
      showErrorToast?: boolean;
      context?: string;
    } = {}
  ) => {
    const {
      onSuccess,
      onError,
      successMessage,
      showErrorToast = true,
      context = 'API Operation'
    } = options;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();

      setState({
        data: result,
        loading: false,
        error: null,
      });

      if (successMessage) {
        showSuccess(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      const apiError = error as Error;

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));

      if (showErrorToast) {
        handleError(apiError, { context });
      }

      if (onError) {
        onError(apiError);
      }

      throw apiError; // Re-throw para que el componente pueda manejarlo si necesita
    }
  }, [ handleError, showSuccess ]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook específico para operaciones CRUD
export function useCrudApi<T, CreateRequest = unknown, UpdateRequest = unknown>() {
  const createApi = useApi<T>();
  const updateApi = useApi<T>();
  const deleteApi = useApi<void>();
  const fetchApi = useApi<T>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showSuccess } = useErrorHandler();

  const create = useCallback(async (
    apiCall: (data: CreateRequest) => Promise<T>,
    data: CreateRequest,
    successMessage = 'Registro creado exitosamente'
  ) => {
    return createApi.execute(
      () => apiCall(data),
      {
        successMessage,
        context: 'Create Operation'
      }
    );
  }, [ createApi ]);

  const update = useCallback(async (
    apiCall: (id: number, data: UpdateRequest) => Promise<T>,
    id: number,
    data: UpdateRequest,
    successMessage = 'Registro actualizado exitosamente'
  ) => {
    return updateApi.execute(
      () => apiCall(id, data),
      {
        successMessage,
        context: 'Update Operation'
      }
    );
  }, [ updateApi ]);

  const remove = useCallback(async (
    apiCall: (id: number) => Promise<void>,
    id: number,
    successMessage = 'Registro eliminado exitosamente'
  ) => {
    return deleteApi.execute(
      () => apiCall(id),
      {
        successMessage,
        context: 'Delete Operation'
      }
    );
  }, [ deleteApi ]);

  const fetch = useCallback(async (
    apiCall: () => Promise<T>,
    context = 'Fetch Operation'
  ) => {
    return fetchApi.execute(apiCall, {
      context,
      showErrorToast: true
    });
  }, [ fetchApi ]);

  return {
    // Estados individuales
    create: {
      ...createApi,
      execute: create,
    },
    update: {
      ...updateApi,
      execute: update,
    },
    delete: {
      ...deleteApi,
      execute: remove,
    },
    fetch: {
      ...fetchApi,
      execute: fetch,
    },

    // Estados combinados
    isLoading: createApi.loading || updateApi.loading || deleteApi.loading || fetchApi.loading,
    hasError: !!(createApi.error || updateApi.error || deleteApi.error || fetchApi.error),
  };
}

// Hook para listas con paginación
export function useListApi<T, TFilters = Record<string, unknown>>() {
  const [filters, setFilters] = useState<TFilters>({} as TFilters);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });

  const listApi = useApi<{ content: T[]; pagination: PaginationInfo }>();

  const fetchList = useCallback(async (
    apiCall: (params: TFilters & { page: number; size: number }) => Promise<{ content: T[]; pagination: PaginationInfo }>,
    newFilters?: Partial<TFilters>,
    resetPage = false
  ) => {
    const currentFilters = { ...filters, ...newFilters };
    const currentPage = resetPage ? 0 : pagination.page;
    
    setFilters(currentFilters);
    
    const result = await listApi.execute(
      () => apiCall({
        ...currentFilters,
        page: currentPage,
        size: pagination.size,
      }),
      {
        context: 'List Operation',
        showErrorToast: true,
      }
    );

    if (result) {
      setPagination(prev => ({
        ...prev,
        page: result.pagination.page,
        totalElements: result.pagination.totalElements,
        totalPages: result.pagination.totalPages,
      }));
    }

    return result;
  }, [filters, pagination.page, pagination.size, listApi]);

  const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const changePage = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const changePageSize = useCallback((newSize: number) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  }, []);

  const reset = useCallback(() => {
    setFilters({} as TFilters);
    setPagination({
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });
    listApi.reset();
  }, [listApi]);

  return {
    // Datos
    items: listApi.data?.content || [],
    pagination,
    filters,
    
    // Estados
    loading: listApi.loading,
    error: listApi.error,
    
    // Acciones
    fetchList,
    updateFilters,
    changePage,
    changePageSize,
    reset,
  };
}

export default useApi;