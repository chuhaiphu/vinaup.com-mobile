import { DateFilterParam } from '@/interfaces/_query-param.interfaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
// Helper function to build date filter params
// Return URLSearchParams object contains date filter parameters
//
// Example:
// Input: { date: new Date('2024-01-15') }
// Output: URLSearchParams object
//   - params.get('date') === '2024-01-15'
//   - params.toString() === 'date=2024-01-15'
//
// Input: { month: 3, year: 2024 }
// Output: URLSearchParams object
//   - params.get('month') === '3'
//   - params.get('year') === '2024'
//   - params.toString() === 'month=3&year=2024'
function buildDateFilterParams(
  filter?: DateFilterParam,
  params: URLSearchParams = new URLSearchParams()
): URLSearchParams {
  if (filter) {
    if (filter.date)
      params.append('date', dayjs(filter.date).utc().format('YYYY-MM-DD'));
    if (filter.month) params.append('month', filter.month.toString());
    if (filter.quarter) params.append('quarter', filter.quarter.toString());
    if (filter.year) params.append('year', filter.year.toString());
  }
  return params;
}

// Generic function to build query string with date filter and additional params
// Return query string in the form "?key=value&key2=value2" to use in URL
//
// Example:
// Input: { date: new Date('2024-01-15') }
// Output: "?date=2024-01-15"
//
// Input: { month: 3, year: 2024 }, { status: 'ACTIVE', type: 'RECEIPT' }

// Output: "?month=3&year=2024&status=ACTIVE&type=RECEIPT"
export function buildFilterQueryString(
  filter?: DateFilterParam,
  additionalParams?: Record<string, string | undefined>
): string {
  const params = buildDateFilterParams(filter);

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}
