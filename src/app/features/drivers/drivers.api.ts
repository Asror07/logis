import type {
  CreateDriverDto,
  DriverResponse,
  DriversListResponse,
  DriversQueryParams,
  PatchDriverDto,
  UpdateDriverDto,
} from "@/pages/drivers/type";
import { baseApi } from "../../services/baseApi";

// Error response type from API
export interface DriverApiError {
  status: number;
  data: {
    message?: string;
    detail?: string;
    errors?: Record<string, string[]>;
    [key: string]: unknown;
  };
}

// Helper to build query string from params
const buildQueryString = (params?: DriversQueryParams): string => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const driversApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // download drivers list
    downloadDrivers: builder.mutation<Blob, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: "/drivers/export/",
          method: "GET",
          responseHandler: (response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as Blob };
      },
    }),
    // GET /drivers/ - List all drivers with pagination and filters
    getDrivers: builder.query<DriversListResponse, DriversQueryParams | void>({
      query: (params) => ({
        url: `/drivers/${buildQueryString(params || undefined)}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Drivers" as const,
                id,
              })),
              { type: "Drivers", id: "LIST" },
            ]
          : [{ type: "Drivers", id: "LIST" }],
    }),

    // GET /drivers/:id/ - Get single driver by ID
    getDriverById: builder.query<DriverResponse, number>({
      query: (id) => ({
        url: `/drivers/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Drivers", id }],
    }),

    // POST /drivers/create/ - Create new driver
    createDriver: builder.mutation<DriverResponse, CreateDriverDto>({
      query: (body) => ({
        url: "/drivers/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Drivers", id: "LIST" }],
    }),

    // PUT /drivers/:id/ - Full update of driver
    updateDriver: builder.mutation<DriverResponse, UpdateDriverDto>({
      query: ({ id, ...body }) => ({
        url: `/drivers/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Drivers", id },
        { type: "Drivers", id: "LIST" },
      ],
    }),

    // PATCH /drivers/:id/ - Partial update of driver
    patchDriver: builder.mutation<DriverResponse, PatchDriverDto>({
      query: ({ id, ...body }) => ({
        url: `/drivers/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Drivers", id },
        { type: "Drivers", id: "LIST" },
      ],
    }),

    // DELETE /drivers/:id/ - Delete driver
    deleteDriver: builder.mutation<void, number>({
      query: (id) => ({
        url: `/drivers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Drivers", id },
        { type: "Drivers", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useLazyGetDriversQuery,
  useLazyGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  usePatchDriverMutation,
  useDeleteDriverMutation,
  useDownloadDriversMutation,
} = driversApi;
