import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
  [key: string]: unknown;
}

export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unexpected error occurred";

  const fetchError = error as FetchBaseQueryError;

  if (fetchError.status === "FETCH_ERROR") {
    return "Network error. Please check your connection.";
  }

  if (fetchError.status === "PARSING_ERROR") {
    return "Invalid response from server.";
  }

  if (typeof fetchError.status === "number") {
    const data = fetchError.data as ApiErrorResponse | undefined;

    if (data?.non_field_errors?.length) {
      return data.non_field_errors.join(", ");
    }

    if (data?.errors) {
      const messages = Object.entries(data.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
        .join("; ");
      return messages;
    }

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;

    switch (fetchError.status) {
      case 400:
        return "Invalid email or password.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "Access denied.";
      case 404:
        return "Service not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Request failed with status ${fetchError.status}`;
    }
  }

  return "An unexpected error occurred";
};
