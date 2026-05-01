/**
 * Extracts a message from an unknown error value.
 * Handles strings, Error objects, and anything else by returning the fallback.
 *
 * @param error - The caught error value (unknown).
 * @param fallback - Message returned when extraction fails. Defaults to 'Có lỗi xảy ra'.
 * @returns A non-empty message string.
 * @example
 * Alert.alert('Lỗi', generateErrorMessage(error));
 */
export function generateErrorMessage(error: unknown, fallback = 'Có lỗi xảy ra'): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
}
