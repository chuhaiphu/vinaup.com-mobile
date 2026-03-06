import { STORAGE_KEYS } from '@/constants/app-constant';
import { HttpResponse } from '@/interfaces/_base-interfaces';
import { ApiError } from '@/utils/api-error';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
console.log('BASE_URL', BASE_URL);
export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<HttpResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.accessToken);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-request-platform': 'mobile',
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    console.log('url', url);
    console.log('method', config.method);

    // Handle errors from Backend responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown server error', error: 'UNKNOWN' };
      }
      throw new ApiError(errorData.message, errorData.error, response.status);
    }

    // Handle successful responses
    const httpResponse: HttpResponse<T> = await response.json();

    console.log('success response', httpResponse);

    return httpResponse;
  } catch (error) {
    console.log('error response', error);
    if (error instanceof ApiError) {
      throw error;
    }

    // Else it's a network error
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown network error',
      'NETWORK_ERROR',
      520
    );
  }
}
