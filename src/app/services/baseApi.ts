import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import type { RefreshResponse } from "../features/auth/auth.types";
import { logout, setAccessToken } from "../features/auth/authSlice";
import type { RootState } from "../store";

const mutex = new Mutex();

// Storage keys (must match authSlice)
const REFRESH_TOKEN_KEY = "refreshToken";

const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const rawBaseQuery = fetchBaseQuery({
  // baseUrl: "https://api.logistic.kotib.ai/api/v1",
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if refresh is in progress
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Get refresh token from localStorage
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          api.dispatch(logout());
          return result;
        }

        // Try to refresh the token
        const refreshResult = await rawBaseQuery(
          {
            url: "/users/token/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const { access } = refreshResult.data as RefreshResponse;
          api.dispatch(setAccessToken(access));
          // Retry original request with new token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user and redirect to login
          api.dispatch(logout());

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return result;
        }
      } finally {
        release();
      }
    } else {
      // Wait for refresh to complete
      await mutex.waitForUnlock();

      // Check if user is still authenticated after refresh
      const state = api.getState() as RootState;
      if (state.auth.accessToken) {
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Not authenticated, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Post", "Drivers"],
  endpoints: () => ({}),
});
