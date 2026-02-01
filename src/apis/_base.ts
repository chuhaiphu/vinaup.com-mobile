import { HttpResponse } from "@/interfaces/_base-interfaces";
import { ApiError } from "@/utils/classes";


export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<HttpResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-request-platform': 'mobile',
    ...options.headers,
  };
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle errors from Backend responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        // console.log(errorData);
      } catch {
        errorData = { message: 'Unknown server error', error: 'UNKNOWN' };
      }
      throw new ApiError(errorData.message, errorData.error, response.status);
    }

    // Handle successful responses
    const httpResponse: HttpResponse<T> = await response.json();
    return httpResponse;

  } catch (error) {
    // Then throw it for the caller to handle
    if (error instanceof ApiError) {
      throw error;
    }

    // Else it's a network error
    throw new ApiError(error instanceof Error ? error.message : "Unknown network error", "NETWORK_ERROR", 520);
  }
}