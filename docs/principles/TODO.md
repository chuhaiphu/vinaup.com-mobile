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

### [H · M] `auth-provider.tsx` interceptor — stale closure

**Principle:** KISS — avoid hidden fragility

**File:** `src/providers/auth-provider.tsx` lines 108–118

`performLogout` is captured in a `useEffect` closure with an empty dependency array. If `performLogout` changes identity, the interceptor calls the stale version.

**Fix:** Use a `useRef` to hold a stable reference:
```ts
const logoutRef = useRef(performLogout);
useEffect(() => { logoutRef.current = performLogout; });

useEffect(() => {
  updateWireConfig({
    interceptors: {
      onError: async (error) => {
        if (error.errorCode === 'TOKEN_INVALID') await logoutRef.current();
      },
    },
  });
}, []);
```

---

### [H · M] `loadStorageData` does not handle corrupted JSON

**Principle:** KISS — explicit, complete error handling

**File:** `src/providers/auth-provider.tsx` lines 130–141

`JSON.parse(savedUser)` can throw on malformed AsyncStorage data. The outer `catch` only logs — corrupt data stays in storage and causes the same failure on every restart.

**Fix:**
```ts
const loadStorageData = async () => {
  try {
    const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.currentUser);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        await AsyncStorage.multiRemove([STORAGE_KEYS.currentUser, STORAGE_KEYS.accessToken]);
      }
    }
  } catch (error) {
    console.error('Error loading storage data', error);
  } finally {
    setIsLoading(false);
  }
};
```

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

### [H · L] Three `*-real-list.tsx` components are copy-pasted

**Principle:** DRY

**Files:**
- `src/components/organization/invoice/modals/invoice-org-customer-select-modal/invoice-org-customer-real-list.tsx`
- `src/components/organization/tour/modals/tour-org-customer-select-modal/tour-org-customer-real-list.tsx`
- `src/components/organization/project/modals/organization-project-org-customer-select-modal/organization-project-org-customer-real-list.tsx`

~116 lines each, logic identical.

**Fix:** Create `src/components/commons/org-customer-real-list.tsx`. Accept a `fetchKeyPrefix` prop. Delete the three domain copies.

---

## MEDIUM PRIORITY

### [M · M] Providers set `isNavigating` — State layer concerns itself with UI

**Principle:** SoC — providers must not depend on UI state

**Files:** `src/providers/invoice-detail-provider.tsx`, `booking-detail-provider.tsx`, `organization-project-detail-provider.tsx`, `personal-project-detail-provider.tsx`

All four import `useNavigationStore` and call `setIsNavigating(true/false)` inside mutation callbacks. Navigation loading overlay is a UI concern — it belongs in the screen or layout that triggers the mutation.

**Fix:** Remove `useNavigationStore` from all four providers. In each calling layout/screen:
```ts
const { setIsNavigating } = useNavigationStore();
const { handleDelete } = useXxxDetailContext();

const onDelete = () => {
  setIsNavigating(true);
  handleDelete(() => setIsNavigating(false));
};
```

---

### [M · S] `PersonalProjectDetailProvider` double-fetches after mutation

**Principle:** KISS — no unnecessary network calls

**File:** `src/providers/personal-project-detail-provider.tsx` lines 82–96

After `updateProject` succeeds, the code calls `await refreshProject()` despite `invalidatesTags` already triggering a cache refresh automatically. `OrganizationProjectDetailProvider` (the parallel provider) does not do this — confirming the inconsistency.

**Fix:** Remove `await refreshProject()` from the `onSuccess` callback.

---

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

### [M · S] `loginApi` uses positional parameters — inconsistent with all other APIs

**Principle:** KISS (consistency reduces cognitive load)

**File:** `src/apis/auth-apis.ts`

```ts
// Current — only API in the project with positional params
loginApi(email: string, password: string)

// Convention used everywhere else
loginApi(data: { email: string; password: string })
```

**Fix:** Change signature. Update the one caller in `auth-provider.tsx`.

---

### [M · S] DELETE operations return mixed types (`void` vs `null`)

**Principle:** KISS (consistency)

`organization-apis.ts` returns `wireApi<void>`; all other API files return `wireApi<null>`.

**Fix:** Update all DELETE functions to `wireApi<void>`:
`booking-apis.ts`, `invoice-apis.ts`, `tour-apis.ts` (×4), `receipt-payment-apis.ts`, `project-apis.ts`, `social-link-apis.ts`.

---

### [M · S] `searchUsersApi` builds URLSearchParams manually

**Principle:** DRY — `buildFilterQueryString` exists for this

**File:** `src/apis/user-apis.ts` lines 20–29

**Fix:**
```ts
export async function searchUsersApi(filter?: UserSearchParam) {
  const qs = buildFilterQueryString(filter, { query: filter?.query });
  return wireApi<UserResponse[]>(`/user/search${qs}`, { method: 'GET' });
}
```

---

### [M · S] List components show no error state on fetch failure

**Principle:** KISS — explicit, complete UI state handling

All `*-list-section-content.tsx` files handle `isRefreshing` but not fetch errors. Users see an empty list with no explanation when the API fails.

**Fix:** Use `useFetchFn`'s error result (or a try/catch in `useEffect`) to set an error state, and render an inline message with a retry button when `data` is null after loading completes.

---

### [M · S] `OrganizationCustomerProvider` instantiated inside component body

**Principle:** SoC — provider lifecycle should be stable, not tied to parent re-renders

**File:** `src/components/organization/project/detail/organization-project-detail-content.tsx`

Rendering a provider inside a component body causes it to remount on every parent re-render, triggering a new fetch each time.

**Fix:** Lift `OrganizationCustomerProvider` to `src/app/(protected)/project-detail/[projectId].tsx`, alongside the other detail providers.

---

### [M · S] `src/interfaces/store-interfaces.ts` — Core layer file containing a State layer type

**Principle:** SoC — layer boundaries

`ModalStore` is a Zustand store interface. It does not belong in `src/interfaces/` alongside API response types.

**Fix:** Move `ModalStore` into `src/hooks/use-modal-store.ts`, co-located with the `createModalStore` factory that uses it.

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

## Summary

| Priority | S tasks | M tasks | L tasks | Total |
|----------|:-------:|:-------:|:-------:|:-----:|
| High | 0 | 2 | 2 | 4 |
| Medium | 6 | 3 | 0 | 9 |
| Low | 6 | 0 | 0 | 6 |
| **Total** | **12** | **5** | **2** | **19** |

**Recommended sprint order:**
1. [H·M] Fix stale closure in auth interceptor
2. [H·M] Fix corrupted JSON handling in `loadStorageData`
3. [M·S] Remove redundant `refreshProject()` in `PersonalProjectDetailProvider`
4. [M·S] Fix DELETE return type consistency across all API files
5. [M·M] Remove `setIsNavigating` from providers → move to screens
6. [M·M] Add `formatDateRange` + `DATE_FORMAT_SHORT` constant
7. [M·S] Fix `loginApi` to accept object parameter
8. [L·S] Delete commented code + empty styles (quick cleanup)
9. [H·L] Consolidate PDF generators into shared helper file
10. [H·L] Extract shared `OrgCustomerRealList` component
11. [H·M] Remove data fetching from card components
