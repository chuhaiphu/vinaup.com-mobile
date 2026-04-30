# Pattern TODO — Refactor & Improvements

Legend: **Priority** H/M/L · **Effort** S (< 1h) / M (1–4h) / L (> 4h)

---

## Factory Pattern

### [H · M] Duplicate comment on `useOrganizationCustomerModalStore`

**File:** `src/hooks/use-modal-store.ts` line 29

The comment on line 29 says `==== ORGANIZATION CUSTOMER MODAL STORE ====` but it is actually `useOrganizationMemberModalStore`. Fix the comment.

---

### [M · S] No factory for non-modal Zustand stores

Currently, utility stores (`useOrganizationUtilitiesStore`, `usePersonalUtilitiesStore`) are structurally identical (same `selections` shape, same `toggleUtility`/`setUtilities`/`resetUtilities` methods, same `persist` config) but are copy-pasted.

**Recommendation:** Extract a `createUtilityStore(storageKey)` factory:

```ts
function createUtilityStore(storageKey: string) {
  return create<UtilityStore>()(persist(
    (set, get) => ({
      selections: {},
      getSelectedUtilities: (id) => get().selections[id] ?? [],
      toggleUtility: (id, key) => set((state) => { ... }),
      setUtilities:  (id, util) => set((state) => { ... }),
      resetUtilities:(id) => set((state) => { ... }),
    }),
    { name: storageKey, storage: createJSONStorage(() => AsyncStorage) }
  ));
}

export const useOrganizationUtilitiesStore = createUtilityStore(STORAGE_KEYS.organizationUtilities);
export const usePersonalUtilitiesStore     = createUtilityStore(STORAGE_KEYS.personalUtilities);
```

---

## Provider Pattern

### [H · S] `TourDetailProvider` missing `onError` in `handleUpdateTour`

**File:** `src/providers/tour-detail-provider.tsx` — `handleUpdateTour` at line 56.

Wait — reviewing the file: `onError` **is** present (line 63–65). This is actually fine. ✅

No action needed here.

---

### [H · M] `PersonalProjectDetailProvider` double-fetches after mutation

**File:** `src/providers/personal-project-detail-provider.tsx` lines 82–96.

After a successful `updateProject`, the code calls `await refreshProject()` — but `invalidatesTags` already triggers a cache refresh automatically. This causes two network requests for every update.

**Fix:** Remove `await refreshProject()` from the `onSuccess` callback. Rely solely on `invalidatesTags`.

---

### [H · M] Stale closure in `auth-provider.tsx` interceptor

**File:** `src/providers/auth-provider.tsx` lines 108–118.

`performLogout` is captured in a closure inside a `useEffect` with an empty dependency array `[]`. If `performLogout` were ever redefined (e.g., due to a hook change), the interceptor would call a stale version.

**Fix:** Either add `performLogout` to the dependency array, or extract `updateWireConfig` to module-level init that accepts a stable callback ref:

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
}, []); // stable because logoutRef never changes
```

---

### [H · M] `loadStorageData` does not handle corrupted JSON

**File:** `src/providers/auth-provider.tsx` lines 130–141.

`JSON.parse(savedUser)` can throw if AsyncStorage contains malformed data (e.g., partial write during crash). Currently the `catch` only logs and still calls `setIsLoading(false)` — the app continues as if no user exists. But the corrupt data remains in storage and will fail again on every restart.

**Fix:**
```ts
const loadStorageData = async () => {
  try {
    const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.currentUser);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEYS.currentUser);
        await AsyncStorage.removeItem(STORAGE_KEYS.accessToken);
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

### [M · S] `setIsNavigating` called inside providers — violates provider responsibility

**Files:** `src/providers/invoice-detail-provider.tsx`, `booking-detail-provider.tsx`, `organization-project-detail-provider.tsx`, `personal-project-detail-provider.tsx`.

Providers import `useNavigationStore` and call `setIsNavigating(true/false)` around mutations. This mixes server-state management with UI state management — providers should not know about navigation loading indicators.

**Fix:** Remove `setIsNavigating` calls from all detail providers. Move them to the screen/layout component that calls the mutation handler:

```ts
// In layout or screen component
const { setIsNavigating } = useNavigationStore();
const { handleUpdateXxx } = useXxxDetailContext();

const onSave = () => {
  setIsNavigating(true);
  handleUpdateXxx(fields, () => setIsNavigating(false));
};
```

---

### [M · L] List providers expose no error state

All list providers (`OrganizationProvider`, `InvoiceTypeProvider`, etc.) only expose `isLoading` and `isRefreshing`. When an API call fails, there is no error state for the UI to show a feedback message.

**Recommendation:** Add `error: string | null` to list provider context types and populate it from `useFetchFn`'s error result (if available), or from a caught exception in `useEffect`.

---

## Repository Pattern

### [M · S] `loginApi` uses positional parameters instead of a request object

**File:** `src/apis/auth-apis.ts` line 3.

```ts
// Current — inconsistent with all other API functions
export async function loginApi(email: string, password: string)

// Should be — consistent with register, create*, update*
export async function loginApi(data: LoginRequest)
```

All callers of `loginApi` (currently only `auth-provider.tsx`) must be updated.

---

### [M · S] `searchUsersApi` builds URLSearchParams manually

**File:** `src/apis/user-apis.ts` lines 20–29.

This is the only API function in the project that does not use `buildFilterQueryString`. Fix:
```ts
export async function searchUsersApi(filter?: UserSearchParam) {
  const qs = buildFilterQueryString(filter, { query: filter?.query });
  return wireApi<UserResponse[]>(`/user/search${qs}`, { method: 'GET' });
}
```

---

### [M · S] Mixed DELETE return types (`void` vs `null`)

`organization-apis.ts` returns `wireApi<void>` for deletes; all other API files return `wireApi<null>`. Convention: **always use `wireApi<void>`**.

Files to update: `booking-apis.ts`, `invoice-apis.ts`, `tour-apis.ts`, `receipt-payment-apis.ts`, `project-apis.ts`, `social-link-apis.ts`.

---

## Composite Pattern

### [H · L] Three `*-real-list.tsx` files are copy-pasted

**Files:**
- `src/components/organization/invoice/modals/invoice-org-customer-select-modal/invoice-org-customer-real-list.tsx`
- `src/components/organization/tour/modals/tour-org-customer-select-modal/tour-org-customer-real-list.tsx`
- `src/components/organization/project/modals/organization-project-org-customer-select-modal/organization-project-org-customer-real-list.tsx`

All three are ~116 lines with identical logic. The only variation is the `fetchKey` prefix string.

**Fix:** Create `src/components/commons/org-customer-real-list.tsx` accepting `fetchKey` as a prop, and replace all three files with imports of this shared component.

---

### [M · M] `OrganizationCustomerProvider` re-created on every render in org-project-detail-content

**File:** `src/components/organization/project/detail/organization-project-detail-content.tsx`

`OrganizationCustomerProvider` is rendered inside a component body, causing a new provider (and new fetch) every time the parent re-renders. It should be lifted to the nearest stable ancestor — the `project-detail/[projectId].tsx` screen file.
