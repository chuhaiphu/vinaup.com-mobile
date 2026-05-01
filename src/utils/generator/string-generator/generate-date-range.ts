import dayjs from 'dayjs';
import { DATE_FORMAT_SHORT } from '@/constants/app-constant';

/**
 * Formats a date range into a compact display string. If start and end fall on the
 * same day, returns a single date instead of a range.
 *
 * @param start - ISO date string for the start date.
 * @param end - ISO date string for the end date.
 * @param format - dayjs pattern. Defaults to DATE_FORMAT_SHORT ('DD/MM').
 * @returns A string such as "10/04" or "10/04 - 13/04".
 * @example
 * generateDateRange('2026-04-10', '2026-04-10'); // "10/04"
 * generateDateRange('2026-04-10', '2026-04-13'); // "10/04 - 13/04"
 */
export function generateDateRange(start: string, end: string, format = DATE_FORMAT_SHORT): string {
  const s = dayjs(start).format(format);
  const e = dayjs(end).format(format);
  return s === e ? s : `${s} - ${e}`;
}
