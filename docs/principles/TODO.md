# Principles TODO — Codebase Review & Refactor Tasks

Full review of the codebase against Clean Code (DRY, KISS), Separation of Concerns (SoC), and React patterns.

Legend: **Priority** H/M/L · **Effort** S (< 1h) / M (1–4h) / L (> 4h)

---

## HIGH PRIORITY

### [H · M] Card components fetch data — violates SoC (UI layer → API layer)

**Principle:** SoC — UI layer must not depend on API layer

**Files:**
- `src/components/commons/cards/project-card.tsx` (lines 20–33)
- `src/components/organization/invoice/invoice-card.tsx` (lines 25–32)

Both cards import `getReceiptPaymentsByXxxIdApi` and run `useFetchFn` internally. A card component's concern is rendering. Fetching is a container/screen concern.

**Fix:**
- Remove `useFetchFn`, the `useEffect`, and the API import from both card components.
- Add a `receiptPaymentsSummary?: ReceiptPaymentSummary` prop to each card.
- In the parent list component, fetch receipt payments once and pass the pre-calculated summary as a prop.

---

### [H · L] Two PDF generator files — 1300+ duplicated lines

**Principle:** DRY

**Files:**
- `src/utils/tour-calculation-cancel-log-pdf.ts` (~664 lines)
- `src/utils/tour-settlement-cancel-log-pdf.ts` (~664 lines)

`escapeHtml`, `formatDateTime`, `buildReceiptPaymentRows`, the CSS block, and most of the HTML template are duplicated across both files.

**Fix:**
1. Create `src/utils/tour-pdf-helpers.ts` — move all shared functions and the CSS template here.
2. Each original file retains only its domain-specific HTML sections and calls helpers from the shared file.

---

## MEDIUM PRIORITY

### [M · M] `TourDetailLayout` mixes five concerns

**Principle:** SoC, KISS

**File:** `src/app/(protected)/tour-detail/[tourId]/_layout.tsx` (212 lines)

Delete mutation wiring, save-and-exit logic, status dropdown, layout structure, and route param extraction are all in one file. `useLocalSearchParams` is called twice (in both parent and child component).

**Fix:**
- Extract `useTourDelete(tourId)` hook for the delete flow.
- Pass `tourId` as a prop from `TourDetailLayout` to `TourDetailLayoutContent` — remove the second `useLocalSearchParams` call.

---

### [M · M] `formatDateRange` duplicated in three card components

**Principle:** DRY

**Files:** `project-card.tsx`, `invoice-card.tsx`, `tour-card.tsx`

Same function body repeated identically in all three files.

**Fix:** Add to `src/utils/generator-helpers.ts`:
```ts
export function formatDateRange(start: string, end: string, format = 'DD/MM'): string {
  const s = dayjs(start).format(format);
  const e = dayjs(end).format(format);
  return s === e ? s : `${s} - ${e}`;
}
```
Replace inline functions in all three files. Also add `export const DATE_FORMAT_SHORT = 'DD/MM'` to `src/constants/app-constant.ts`.

---

### [M · S] List components show no error state on fetch failure

**Principle:** KISS — explicit, complete UI state handling

All `*-list-section-content.tsx` files handle `isRefreshing` but not fetch errors. Users see an empty list with no explanation when the API fails.

**Fix:** Use `useFetchFn`'s error result (or a try/catch in `useEffect`) to set an error state, and render an inline message with a retry button when `data` is null after loading completes.

---

## LOW PRIORITY

### [L · S] Commented-out code blocks

**Principle:** KISS — dead code adds noise

- `src/app/(protected)/tour-detail/[tourId]/_layout.tsx` lines 74–87
- `src/components/organization/invoice/invoice-card.tsx` lines 134–140
- `src/components/commons/cards/receipt-payment-card.tsx` line 27

**Fix:** Delete all of them.

---

### [L · S] Empty `StyleSheet` entries

**Principle:** KISS — no placeholder code

`descriptionContainer: {}`, `code: {}`, `action: {}`, `senderInfo: {}`, `receiverInfo: {}` appear in several card and receipt-payment components.

**Fix:** Delete all empty style entries.

---

### [L · S] Hardcoded color values in `select.tsx` and `multiple-select.tsx`

**Principle:** DRY

`#333`, `#444`, `#EEE` inline in `src/components/primitives/select.tsx`. These should reference `COLORS.*` from `src/constants/style-constant.ts`.

---

### [L · S] Snapshot data interfaces use `[key: string]: unknown`

**Principle:** KISS — do not defeat TypeScript

**Files:** `src/interfaces/tour-calculation-interfaces.ts`, `tour-settlement-interfaces.ts`

The index signature and the union with `Record<string, unknown>` make these interfaces effectively untyped. Type optional fields explicitly; remove the escape hatches.

---

### [L · S] `OrganizationCustomerResponse.status` is untyped `string`

**Principle:** KISS — use the type system

**File:** `src/interfaces/organization-customer-interfaces.ts`

**Fix:** Define `ORGANIZATION_CUSTOMER_STATUS` enum in `src/constants/organization-constants.ts` and use the derived type in the interface.

---

### [L · S] Typo in `generator-helpers.ts` console warning

**File:** `src/utils/generator-helpers.ts` line 65

`'Loi khi convert ...'` → `'Lỗi khi convert ...'`

---

### [L · S] `deleteImageApi` returns `wireApi<null>` — should be `wireApi<void>`

**Principle:** KISS (consistency) — all DELETE functions must return `wireApi<void>`

**File:** `src/apis/upload-apis.ts`

```ts
// ❌ Current
export async function deleteImageApi(path: string) {
  return wireApi<null>('/upload', { method: 'DELETE', body: JSON.stringify({ path }) });
}

// ✅ Fix
export async function deleteImageApi(path: string) {
  return wireApi<void>('/upload', { method: 'DELETE', body: JSON.stringify({ path }) });
}
```

---

## Summary

| Priority | S tasks | M tasks | L tasks | Total |
|----------|:-------:|:-------:|:-------:|:-----:|
| High | 0 | 1 | 1 | 2 |
| Medium | 1 | 2 | 0 | 3 |
| Low | 7 | 0 | 0 | 7 |
| **Total** | **8** | **3** | **1** | **12** |
