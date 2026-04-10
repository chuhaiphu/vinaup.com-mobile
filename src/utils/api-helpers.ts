import { DateFilterParam } from '@/interfaces/_query-param.interfaces';

function buildDateFilterParams(
  filter?: DateFilterParam,
  params: URLSearchParams = new URLSearchParams()
): URLSearchParams {
  if (filter) {
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
  }
  return params;
}

// Generic function to build query string with date filter and additional params
// Return query string in the form "?key=value&key2=value2" to use in URL
//
// Example:
// Input: { startDate: '2026-03-31T17:00:00.000Z', endDate: '2026-04-30T16:59:59.999Z' }
// Output: "?startDate=2026-03-31T17%3A00%3A00.000Z&endDate=2026-04-30T16%3A59%3A59.999Z"
//
// Input: { startDate: '...', endDate: '...' }, { status: 'ACTIVE', type: 'RECEIPT' }
// Output: "?startDate=...&endDate=...&status=ACTIVE&type=RECEIPT"
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
