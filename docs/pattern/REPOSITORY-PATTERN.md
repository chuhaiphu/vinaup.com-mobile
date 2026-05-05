# Repository Pattern

## What

A repository is a module that abstracts data access behind a set of named functions.

### API module — one folder per domain

Each folder in `src/apis/` owns exactly one business domain. Simple domains have a single file (`[domain]/[domain].ts`). Complex domains with multiple sub-resources split into separate files (`[domain]/[domain]-[resource].ts`). All files import request/response types from `src/interfaces/`, call `wireApi` from `fetchwire`, and export named async functions.

```
src/apis/
├── auth/auth.ts                          ← authentication
├── booking/booking.ts                    ← bookings
├── category/category.ts                  ← categories
├── invoice/invoice.ts                    ← invoices
├── organization/                         ← organization (complex domain)
│   ├── organization.ts                   ├─ org core
│   ├── organization-customer.ts          ├─ customers
│   ├── organization-member.ts            ├─ members
│   └── organization-role.ts              └─ roles
├── project/project.ts                    ← projects
├── receipt-payment/receipt-payment.ts    ← receipt & payment transactions
├── signature/signature.ts                ← signatures
├── social-link/social-link.ts           ← social profile links
├── tour/                                 ← tour (complex domain)
│   ├── tour.ts                           ├─ tour core
│   ├── tour-calculation.ts               ├─ calculations
│   ├── tour-implementation.ts            ├─ implementations
│   └── tour-settlement.ts                └─ settlements
├── upload/upload.ts                      ← file uploads
└── user/user.ts                          ← user profile
```

### CRUD function set

Each domain exposes a standard set of functions following the `{verb}{Entity}Api` naming convention.

```ts
// src/apis/tour/tour.ts (core tour operations)
export async function createTourApi(data: CreateTourRequest) {
  return wireApi<TourResponse>('/tour', { method: 'POST', body: JSON.stringify(data) });
}

export async function getToursByOrganizationIdApi(organizationId: string, filter?: TourFilterParam) {
  const qs = generateFilterQueryString(filter, { status: filter?.status });
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

// src/apis/tour/tour-calculation.ts (tour calculation operations)
export async function getTourCalculationByTourIdApi(tourId: string) {
  return wireApi<ResponseWithMeta<TourCalculationResponse, TourCalculationMeta>>(`/tour-calculation/by-tour/${tourId}`, { method: 'GET' });
}

export async function updateTourCalculationApi(tourCalculationId: string, data: UpdateTourCalculationRequest) {
  return wireApi<TourCalculationResponse>(`/tour-calculation/${tourCalculationId}`, { method: 'PUT', body: JSON.stringify(data) });
}
```

### Filter query string utility

All list endpoints that accept filter parameters use `generateFilterQueryString` from `src/utils/generator/string-generator/generate-filter-query-string.ts`. This function handles date range params and any additional key-value pairs, returning a correctly encoded query string.

```ts
// src/utils/generator/string-generator/generate-filter-query-string.ts
export function generateFilterQueryString(
  filter?: DateFilterParam,
  additionalParams?: Record<string, string | undefined>
): string {
  const params = generateDateFilterParams(filter);
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

Without a repository layer, every provider, hook, and screen that needs data have to construct it owns API fetcing function shape. A change to an endpoint URL or response field requires finding and updating every caller.

The API layer creates a single source of truth for each endpoint. When the backend changes a URL or renames a field, only the relevant `*-apis.ts` file changes. Providers and screens remain untouched.

---

## How

### Rule 1 — No `wireApi` calls outside `src/apis/`

Providers, hooks, components, and screens never import `wireApi` directly. They import named functions from the relevant `*-apis.ts` file.

```ts
// ✅
import { updateTourApi } from '@/apis/tour/tour';
useMutationFn((fields) => updateTourApi(tourId, fields), { ... });

// ✅ (also correct for other domains)
import { updateInvoiceApi } from '@/apis/invoice/invoice';
import { createOrganizationCustomerApi } from '@/apis/organization/organization-customer';

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

### Rule 3 — All filter list endpoints use `generateFilterQueryString`

Never build `URLSearchParams` manually inside an API function.

```ts
// ✅
const qs = generateFilterQueryString(filter, { status: filter?.status });
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

### Rule 5 — One folder per domain; do not cross domains

Booking functions go in `booking/booking.ts`. Do not add a booking API function to `invoice/invoice.ts` because it is "related". For complex domains with sub-resources (e.g., organization, tour), organize related functions into separate files within the same folder: `organization/organization.ts`, `organization/organization-customer.ts`, etc.

### Rule 6 — Naming follows `{verb}{Entity}Api` exactly

| Verb | HTTP method | Example |
|------|------------|---------|
| `create` | POST | `createTourApi` |
| `get` | GET (one or many) | `getTourByIdApi`, `getToursByOrganizationIdApi` |
| `update` | PATCH | `updateTourApi` |
| `delete` | DELETE | `deleteTourApi` |
| `search` | GET with query | `searchUsersApi` |

### Adding a new API module

**For simple domains (few related functions):**

```ts
// src/apis/xxx/xxx.ts
import { XxxResponse, CreateXxxRequest, UpdateXxxRequest } from '@/interfaces/xxx-interfaces';
import { XxxFilterParam } from '@/interfaces/_query-param.interfaces';
import { wireApi } from 'fetchwire';
import { generateFilterQueryString } from '@/utils/generator/string-generator/generate-filter-query-string';

export async function createXxxApi(data: CreateXxxRequest) {
  return wireApi<XxxResponse>('/xxx', { method: 'POST', body: JSON.stringify(data) });
}

export async function getXxxsApi(filter?: XxxFilterParam) {
  const qs = generateFilterQueryString(filter, { status: filter?.status });
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

**For complex domains (multiple sub-resources):**

```ts
// src/apis/xxx/xxx.ts (core operations)
export async function createXxxApi(data: CreateXxxRequest) { ... }
export async function getXxxByIdApi(id: string) { ... }
export async function updateXxxApi(id: string, data: UpdateXxxRequest) { ... }
export async function deleteXxxApi(id: string) { ... }

// src/apis/xxx/xxx-resource.ts (sub-resource operations)
export async function createXxxResourceApi(data: CreateXxxResourceRequest) { ... }
export async function getXxxResourcesByXxxIdApi(xxxId: string) { ... }
export async function updateXxxResourceApi(id: string, data: UpdateXxxResourceRequest) { ... }
export async function deleteXxxResourceApi(id: string) { ... }
```
