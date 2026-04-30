# Repository Pattern

## Intent

Isolate all HTTP communication behind a thin function layer (`src/apis/`). The rest of the app — providers, hooks, screens — never imports `wireApi` or constructs URLs directly; it only calls named functions from the API layer.

---

## Where It Is Used

All files in `src/apis/`. Each file owns one business domain:

| File | Domain |
|------|--------|
| `auth-apis.ts` | Authentication |
| `user-apis.ts` | User profile |
| `organization-apis.ts` | Organizations, members, roles |
| `tour-apis.ts` | Tours + calculations + settlements + implementations |
| `booking-apis.ts` | Bookings |
| `invoice-apis.ts` | Invoices |
| `receipt-payment-apis.ts` | Receipt & payment transactions |
| `project-apis.ts` | Projects |
| `category-apis.ts` | Categories |
| `signature-apis.ts` | Signatures |
| `upload-apis.ts` | File uploads |
| `social-link-apis.ts` | Social profile links |

---

## Anatomy of an API Function

Every function follows the same shape:

```ts
// src/apis/tour-apis.ts

// CREATE
export async function createTourApi(data: CreateTourRequest) {
  return wireApi<TourResponse>('/tour', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// READ (list with filter)
export async function getToursByOrganizationIdApi(
  organizationId: string,
  filter?: TourFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, { status: filter?.status });
  return wireApi<TourResponse[]>(`/tour/organization/${organizationId}${filterQueryString}`, {
    method: 'GET',
  });
}

// READ (single by ID)
export async function getTourByIdApi(id: string) {
  return wireApi<TourResponse>(`/tour/${id}`, { method: 'GET' });
}

// UPDATE
export async function updateTourApi(id: string, data: UpdateTourRequest) {
  return wireApi<TourResponse>(`/tour/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// DELETE
export async function deleteTourApi(id: string) {
  return wireApi<void>(`/tour/${id}`, { method: 'DELETE' });
}
```

---

## Naming Convention

```
{verb}{Entity}Api()
```

| Verb | Meaning | Example |
|------|---------|---------|
| `create` | POST new entity | `createTourApi` |
| `get` | GET one or many | `getTourByIdApi`, `getToursByOrganizationIdApi` |
| `update` | PATCH partial fields | `updateTourApi` |
| `delete` | DELETE entity | `deleteTourApi` |
| `search` | GET with search query | `searchUsersApi` |

---

## Filter Query String Utility

All list endpoints with filters use `buildFilterQueryString` from `src/utils/api-helpers.ts`:

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

// Usage in api file:
const qs = buildFilterQueryString(filter, { status: filter?.status, type: filter?.type });
return wireApi<InvoiceResponse[]>(`/invoice/organization/${orgId}${qs}`, { method: 'GET' });
```

**Do not** construct `URLSearchParams` manually inside API functions — always use this helper.

---

## Type Contracts

Every API function is fully typed at both ends:

```ts
// Request type — defined in src/interfaces/*-interfaces.ts
export interface CreateTourRequest { ... }
export type UpdateTourRequest = Partial<CreateTourRequest> & { ... };

// Response type — returned via generic parameter
wireApi<TourResponse>(...)        // returns Promise<WireResponse<TourResponse>>
wireApi<TourResponse[]>(...)      // returns Promise<WireResponse<TourResponse[]>>
wireApi<void>(...)                // DELETE — no body expected
```

---

## Rules

1. **Screens and providers never import `wireApi` directly** — only `*-apis.ts` files do.
2. **All DELETE operations return `wireApi<void>`** — not `wireApi<null>`.
3. **All filter-based GET endpoints use `buildFilterQueryString`** — never manual `URLSearchParams`.
4. **Function parameters use a typed request interface** — not inline `{ field: string }` objects, except for simple single-param calls (`id: string`).
5. **One file per domain** — do not add booking API functions to `invoice-apis.ts`.
6. **Naming follows `{verb}{Entity}Api` exactly** — `loginApi` is a legacy exception that should be migrated to accept `LoginRequest`.

---

## Adding a New API Module

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
