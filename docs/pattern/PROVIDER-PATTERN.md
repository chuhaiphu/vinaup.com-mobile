# Provider Pattern

## Intent

Wrap a subtree of the component tree with a React Context that owns server-derived state for a specific domain or entity. Consumers anywhere in the subtree can access data and mutation handlers without prop-drilling.

---

## Where It Is Used

All files in `src/providers/`. There are two variants:

| Variant | Purpose | Examples |
|---------|---------|---------|
| **List Provider** | Fetches a list, exposes refresh | `OrganizationProvider`, `AllOrganizationsProvider`, `InvoiceTypeProvider`, `OrganizationCustomerProvider` |
| **Detail Provider** | Fetches a single entity by ID, exposes update/delete mutations | `TourDetailProvider`, `BookingDetailProvider`, `InvoiceDetailProvider`, `OrganizationProjectDetailProvider`, `PersonalProjectDetailProvider` |
| **Auth Provider** | Special case — manages login/logout/token lifecycle | `AuthProvider` |
| **UI-state Provider** | Thin wrapper with no API calls; pure client state | `OwnerModeProvider` |

---

## Anatomy of a Provider

Every provider follows the same five-part structure:

### 1. Context type interface
```ts
interface TourDetailContextType {
  tourId: string;
  tour: TourResponse | undefined;
  isLoadingTour: boolean;
  isRefreshingTour: boolean;
  isUpdatingTour: boolean;
  handleUpdateTour: (fields: UpdateTourRequest, onSuccess?: () => void) => void;
  refreshTour: () => void;
}
```

### 2. Context creation with `null` default
```ts
const TourDetailContext = createContext<TourDetailContextType | null>(null);
```
Using `null` instead of a dummy default forces a runtime error if a consumer is rendered outside the provider — catching integration mistakes early.

### 3. Custom hook with guard
```ts
export function useTourDetailContext() {
  const ctx = useContext(TourDetailContext);
  if (!ctx)
    throw new Error('useTourDetailContext must be used within TourDetailProvider');
  return ctx;
}
```

### 4. Provider component
```ts
// src/providers/tour-detail-provider.tsx
export function TourDetailProvider({ tourId, children }: { tourId: string; children: React.ReactNode }) {
  const { data: tour, isLoading, isRefreshing, executeFetchFn: fetchTour, refreshFetchFn: refreshTour } =
    useFetchFn(() => getTourByIdApi(tourId), {
      fetchKey: `organization-tour-${tourId}`,
      tags:     [`organization-tour-${tourId}`],
    });

  const { executeMutationFn: updateTour, isMutating: isUpdatingTour } =
    useMutationFn(
      (fields: UpdateTourRequest) => updateTourApi(tourId, fields),
      { invalidatesTags: ['organization-tour-list', `organization-tour-${tourId}`] }
    );

  useEffect(() => { if (tourId) fetchTour(); }, [tourId, fetchTour]);

  const handleUpdateTour = useCallback(
    (fields: UpdateTourRequest, onSuccess?: () => void) => {
      if (!tour) return;
      updateTour(fields, {
        onSuccess: () => onSuccess?.(),
        onError:   (error: ApiError) => Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.'),
      });
    },
    [tour, updateTour]
  );

  return (
    <TourDetailContext value={{ tourId, tour: tour ?? undefined, isLoadingTour: isLoading, isRefreshingTour: isRefreshing, isUpdatingTour, handleUpdateTour, refreshTour }}>
      {children}
    </TourDetailContext>
  );
}
```

### 5. Co-location with route layout
```
src/app/(protected)/tour-detail/[tourId]/_layout.tsx
  └── TourDetailProvider (wraps all sub-screens of this route)
        └── TourDetailLayoutContent (consumes useTourDetailContext)
```

---

## Provider Tree (co-location rules)

```
src/app/_layout.tsx
  └── AuthProvider                          ← global: auth state, token lifecycle

src/app/(protected)/_layout.tsx
  └── AllOrganizationsProvider              ← global: user's full org list (for switcher)
       └── OrganizationProvider             ← global: selected org + list
            └── OwnerModeProvider           ← global: owner/member role toggle

src/app/(protected)/organization/[organizationId]/_layout.tsx
  └── InvoiceTypeProvider                   ← org-scoped: invoice types for this org

tour-detail/[tourId]/_layout.tsx            ← route-scoped detail providers
booking-detail/[bookingId]/index.tsx
invoice-detail/[invoiceId].tsx
project-detail/[projectId].tsx
```

**Rule:** A provider must be placed in the **closest common ancestor** of all screens that need it — no higher.

---

## Rules

1. **Context default is always `null`** — never provide a fake implementation as default.
2. **Always export a custom hook** (`useTourDetailContext`) — consumers never call `useContext` directly.
3. **Providers own mutations** — `handleUpdateTour`, `handleDelete` live in the provider, not in screens. Screens call handlers, not raw API functions.
4. **onError is always handled** — every `executeMutationFn` call must have an `onError` callback with `Alert.alert`.
5. **List providers use `?? []`**, detail providers use `?? undefined` as fallback for missing data.
6. **Providers do not call `setIsNavigating`** — navigation loading state is UI state; it belongs in the screen/layout component that triggers navigation.

---

## Adding a New Detail Provider

```ts
// 1. Define context type
interface XxxDetailContextType {
  xxxId: string;
  xxx: XxxResponse | undefined;
  isLoadingXxx: boolean;
  isRefreshingXxx: boolean;
  isUpdatingXxx: boolean;
  handleUpdateXxx: (fields: UpdateXxxRequest, onSuccess?: () => void) => void;
  refreshXxx: () => void;
}

// 2. Create context with null default
const XxxDetailContext = createContext<XxxDetailContextType | null>(null);

// 3. Export typed hook with guard
export function useXxxDetailContext() {
  const ctx = useContext(XxxDetailContext);
  if (!ctx) throw new Error('useXxxDetailContext must be used within XxxDetailProvider');
  return ctx;
}

// 4. Implement provider
export function XxxDetailProvider({ xxxId, children }: { xxxId: string; children: React.ReactNode }) {
  // useFetchFn + useMutationFn setup ...
  return <XxxDetailContext value={...}>{children}</XxxDetailContext>;
}

// 5. Co-locate in route layout
// src/app/(protected)/xxx-detail/[xxxId]/_layout.tsx
```
