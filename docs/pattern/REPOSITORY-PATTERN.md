# Repository Pattern

## What

A repository is a module that abstracts data access behind a set of named functions.

### API module — one file per domain

Each file in `src/apis/` owns exactly one business domain. It imports the domain's request/response types from `src/interfaces/`, calls `wireApi` from `fetchwire`, and exports named async functions.

```
src/apis/
├── auth-apis.ts           ← authentication
├── user-apis.ts           ← user profile
├── organization-apis.ts   ← org, members, roles, industries
├── tour-apis.ts           ← tours, calculations, settlements, implementations
├── booking-apis.ts        ← bookings
├── invoice-apis.ts        ← invoices
├── receipt-payment-apis.ts← receipt & payment transactions
├── project-apis.ts        ← projects
├── category-apis.ts       ← categories
├── signature-apis.ts      ← signatures
├── upload-apis.ts         ← file uploads
└── social-link-apis.ts    ← social profile links
```

### CRUD function set

Each domain exposes a standard set of functions following the `{verb}{Entity}Api` naming convention.

```ts
// src/apis/tour-apis.ts
export async function createTourApi(data: CreateTourRequest) {
  return wireApi<TourResponse>('/tour', { method: 'POST', body: JSON.stringify(data) });
}

export async function getToursByOrganizationIdApi(organizationId: string, filter?: TourFilterParam) {
  const qs = buildFilterQueryString(filter, { status: filter?.status });
  return wireApi<TourResponse[]>(`/tour/organization/${organizationId}${qs}`, { method: 'GET' });
}

export async function getTourByIdApi(id: string) {
  return wireApi<TourResponse>(`/tour/${id}`, { method: 'GET' });
}

export async function updateTourApi(id: string, data: UpdateTourRequest) {
  return wireApi<TourResponse>(`/tour/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteTourApi(id: string) {
  return wireApi<void>(`/tour/${id}`, { method: 'DELETE' });
}
```

### Filter query string utility

All list endpoints that accept filter parameters use `buildFilterQueryString` from `src/utils/api-helpers.ts`. This function handles date range params and any additional key-value pairs, returning a correctly encoded query string.

```ts
// src/utils/api-helpers.ts
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
```

### Request and response types

Every function is typed at both ends. Request types come from `src/interfaces/`; the generic parameter of `wireApi<T>` declares the response shape.

```ts
// types live in src/interfaces/tour-interfaces.ts
export interface CreateTourRequest { ... }
export type UpdateTourRequest = Partial<CreateTourRequest> & { ... };
export interface TourResponse { id: string; status: TourStatus; ... }

// usage
wireApi<TourResponse>(...)       // single entity
wireApi<TourResponse[]>(...)     // list
wireApi<void>(...)               // delete — no response body
```

---

## Why

Without a repository layer every provider, hook, and screen that needs data constructs its own URL, passes its own headers, and interprets its own response shape. A change to an endpoint URL or response field requires finding and updating every caller. TypeScript cannot catch mismatches because callers hold raw fetch calls, not typed functions.

The API layer creates a single source of truth for each endpoint. When the backend changes a URL or renames a field, only the relevant `*-apis.ts` file changes. Providers and screens remain untouched. TypeScript's generic typing on `wireApi<T>` propagates the correct shape to every caller automatically.

---

## How

### Rule 1 — No `wireApi` calls outside `src/apis/`

Providers, hooks, components, and screens never import `wireApi` directly. They import named functions from the relevant `*-apis.ts` file.

```ts
// ✅
import { updateTourApi } from '@/apis/tour-apis';
useMutationFn((fields) => updateTourApi(tourId, fields), { ... });

// ❌
import { wireApi } from 'fetchwire';
useMutationFn((fields) => wireApi(`/tour/${tourId}`, { method: 'PATCH', body: JSON.stringify(fields) }), { ... });
```

### Rule 2 — All DELETE functions return `wireApi<void>`

```ts
// ✅
export async function deleteTourApi(id: string) {
  return wireApi<void>(`/tour/${id}`, { method: 'DELETE' });
}

// ❌ — inconsistent
return wireApi<null>(`/tour/${id}`, { method: 'DELETE' });
```

### Rule 3 — All filter list endpoints use `buildFilterQueryString`

Never build `URLSearchParams` manually inside an API function.

```ts
// ✅
const qs = buildFilterQueryString(filter, { status: filter?.status });
return wireApi<TourResponse[]>(`/tour/organization/${orgId}${qs}`, { method: 'GET' });

// ❌
const params = new URLSearchParams();
if (filter?.status) params.append('status', filter.status);
return wireApi<TourResponse[]>(`/tour/organization/${orgId}?${params}`, { method: 'GET' });
```

### Rule 4 — Function parameters use typed request interfaces, not inline objects

```ts
// ✅
export async function createTourApi(data: CreateTourRequest)

// ❌
export async function createTourApi(data: { name: string; startDate: string; ... })
```

### Rule 5 — One file per domain; do not cross domains

Booking functions go in `booking-apis.ts`. Do not add a booking API function to `invoice-apis.ts` because it is "related".

### Rule 6 — Naming follows `{verb}{Entity}Api` exactly

| Verb | HTTP method | Example |
|------|------------|---------|
| `create` | POST | `createTourApi` |
| `get` | GET (one or many) | `getTourByIdApi`, `getToursByOrganizationIdApi` |
| `update` | PATCH | `updateTourApi` |
| `delete` | DELETE | `deleteTourApi` |
| `search` | GET with query | `searchUsersApi` |

### Adding a new API module

```ts
// src/apis/xxx-apis.ts
import { XxxResponse, CreateXxxRequest, UpdateXxxRequest } from '@/interfaces/xxx-interfaces';
import { XxxFilterParam } from '@/interfaces/_query-param.interfaces';
import { wireApi } from 'fetchwire';
import { buildFilterQueryString } from '@/utils/api-helpers';

export async function createXxxApi(data: CreateXxxRequest) {
  return wireApi<XxxResponse>('/xxx', { method: 'POST', body: JSON.stringify(data) });
}

export async function getXxxsApi(filter?: XxxFilterParam) {
  const qs = buildFilterQueryString(filter, { status: filter?.status });
  return wireApi<XxxResponse[]>(`/xxx${qs}`, { method: 'GET' });
}

export async function getXxxByIdApi(id: string) {
  return wireApi<XxxResponse>(`/xxx/${id}`, { method: 'GET' });
}

export async function updateXxxApi(id: string, data: UpdateXxxRequest) {
  return wireApi<XxxResponse>(`/xxx/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteXxxApi(id: string) {
  return wireApi<void>(`/xxx/${id}`, { method: 'DELETE' });
}
```
