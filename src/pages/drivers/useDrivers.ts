import {
  useCreateDriverMutation,
  useDeleteDriverMutation,
  useGetDriverByIdQuery,
  useGetDriversQuery,
  useLazyGetDriversQuery,
  usePatchDriverMutation,
  useUpdateDriverMutation,
} from "@/app/features/drivers/drivers.api";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback, useState } from "react";
import type {
  CreateDriverDto,
  DriverResponse,
  DriversQueryParams,
  DriverStatus,
  PatchDriverDto,
  UpdateDriverDto,
  VehicleType,
} from "./type";

// Error response structure from API
interface ApiErrorData {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

// Helper to extract error message from RTK Query error
export const getDriverErrorMessage = (error: unknown): string => {
  if (!error) return "An unexpected error occurred";

  const fetchError = error as FetchBaseQueryError;

  if (fetchError.status === "FETCH_ERROR") {
    return "Network error. Please check your connection.";
  }

  if (fetchError.status === "PARSING_ERROR") {
    return "Invalid response from server.";
  }

  if (typeof fetchError.status === "number") {
    const data = fetchError.data as ApiErrorData | undefined;

    if (data?.errors) {
      return Object.entries(data.errors)
        .map(
          ([field, msgs]) => `${field.replace(/_/g, " ")}: ${msgs.join(", ")}`,
        )
        .join("; ");
    }

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;

    switch (fetchError.status) {
      case 400:
        return "Invalid data provided. Please check your inputs.";
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Driver not found.";
      case 409:
        return "A driver with this information already exists.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Request failed with status ${fetchError.status}`;
    }
  }

  return "An unexpected error occurred";
};

// Hook options
interface UseDriversOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: DriverStatus;
  vehicleType?: VehicleType;
  ordering?: string;
  skip?: boolean;
}

/**
 * Custom hook for managing drivers with RTK Query
 * Provides all CRUD operations and state management
 */
export const useDrivers = (options: UseDriversOptions = {}) => {
  const {
    page = 1,
    pageSize = 10,
    search,
    status,
    vehicleType,
    ordering,
    skip = false,
  } = options;

  // Build query params - convert page/pageSize to limit/offset
  const queryParams: DriversQueryParams = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search && { search }),
    ...(status && { status }),
    ...(vehicleType && { vehicle_type: vehicleType }),
    ...(ordering && { ordering }),
  };

  // RTK Query hooks
  const {
    data: driversData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDriversQuery(queryParams, { skip });

  const [createDriver, createState] = useCreateDriverMutation();
  const [updateDriver, updateState] = useUpdateDriverMutation();
  const [patchDriver, patchState] = usePatchDriverMutation();
  const [deleteDriver, deleteState] = useDeleteDriverMutation();

  // Computed values
  const drivers = driversData?.results ?? [];
  const totalCount = driversData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = !!driversData?.next;
  const hasPrevPage = !!driversData?.previous;

  // Action handlers with error handling
  const handleCreateDriver = useCallback(
    async (data: CreateDriverDto): Promise<DriverResponse> => {
      return await createDriver(data).unwrap();
    },
    [createDriver],
  );

  const handleUpdateDriver = useCallback(
    async (data: UpdateDriverDto): Promise<DriverResponse> => {
      return await updateDriver(data).unwrap();
    },
    [updateDriver],
  );

  const handlePatchDriver = useCallback(
    async (data: PatchDriverDto): Promise<DriverResponse> => {
      return await patchDriver(data).unwrap();
    },
    [patchDriver],
  );

  const handleDeleteDriver = useCallback(
    async (id: number): Promise<void> => {
      await deleteDriver(id).unwrap();
    },
    [deleteDriver],
  );

  // Status change helper
  const changeDriverStatus = useCallback(
    async (id: number, newStatus: DriverStatus): Promise<DriverResponse> => {
      return await patchDriver({ id, status: newStatus }).unwrap();
    },
    [patchDriver],
  );

  return {
    // Data
    drivers,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Loading states
    isLoading,
    isFetching,
    isError,
    error,
    errorMessage: error ? getDriverErrorMessage(error) : null,

    // Refetch
    refetch,

    // CRUD operations
    createDriver: handleCreateDriver,
    updateDriver: handleUpdateDriver,
    patchDriver: handlePatchDriver,
    deleteDriver: handleDeleteDriver,
    changeDriverStatus,

    // Mutation states for UI feedback
    createState: {
      isLoading: createState.isLoading,
      isSuccess: createState.isSuccess,
      isError: createState.isError,
      error: createState.error,
      errorMessage: createState.error
        ? getDriverErrorMessage(createState.error)
        : null,
      reset: createState.reset,
    },
    updateState: {
      isLoading: updateState.isLoading,
      isSuccess: updateState.isSuccess,
      isError: updateState.isError,
      error: updateState.error,
      errorMessage: updateState.error
        ? getDriverErrorMessage(updateState.error)
        : null,
      reset: updateState.reset,
    },
    patchState: {
      isLoading: patchState.isLoading,
      isSuccess: patchState.isSuccess,
      isError: patchState.isError,
      error: patchState.error,
      errorMessage: patchState.error
        ? getDriverErrorMessage(patchState.error)
        : null,
      reset: patchState.reset,
    },
    deleteState: {
      isLoading: deleteState.isLoading,
      isSuccess: deleteState.isSuccess,
      isError: deleteState.isError,
      error: deleteState.error,
      errorMessage: deleteState.error
        ? getDriverErrorMessage(deleteState.error)
        : null,
      reset: deleteState.reset,
    },
  };
};

/**
 * Hook for fetching a single driver by ID
 */
export const useDriver = (id: number, options: { skip?: boolean } = {}) => {
  const { skip = false } = options;

  const {
    data: driver,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDriverByIdQuery(id, { skip: skip || !id });

  return {
    driver,
    isLoading,
    isFetching,
    isError,
    error,
    errorMessage: error ? getDriverErrorMessage(error) : null,
    refetch,
  };
};

/**
 * Hook for lazy loading drivers (manual trigger)
 */
export const useLazyDrivers = () => {
  const [trigger, { data, isLoading, isFetching, isError, error }] =
    useLazyGetDriversQuery();

  const fetchDrivers = useCallback(
    async (params?: DriversQueryParams) => {
      return await trigger(params ?? {}).unwrap();
    },
    [trigger],
  );

  return {
    fetchDrivers,
    drivers: data?.results ?? [],
    totalCount: data?.count ?? 0,
    isLoading,
    isFetching,
    isError,
    error,
    errorMessage: error ? getDriverErrorMessage(error) : null,
  };
};

/**
 * Hook for driver search with debounce-friendly API
 */
export const useDriverSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { drivers, isLoading, isFetching } = useDrivers({
    search: debouncedSearch,
    skip: !debouncedSearch,
  });

  const search = useCallback((term: string) => {
    setSearchTerm(term);
    // You can add debounce logic here or use useDeferredValue
    setDebouncedSearch(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearch("");
  }, []);

  return {
    searchTerm,
    search,
    clearSearch,
    results: drivers,
    isSearching: isLoading || isFetching,
  };
};

// Re-export types for convenience
export type {
  CreateDriverDto,
  DriverResponse,
  DriversQueryParams,
  DriverStatus,
  PatchDriverDto,
  UpdateDriverDto,
  VehicleType,
};

// Re-export raw RTK Query hooks for advanced usage
export {
  useCreateDriverMutation,
  useDeleteDriverMutation,
  useGetDriverByIdQuery,
  useGetDriversQuery,
  useLazyGetDriversQuery,
  usePatchDriverMutation,
  useUpdateDriverMutation,
} from "@/app/features/drivers/drivers.api";
