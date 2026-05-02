# Provider Pattern

## What

A provider is a React Context component that owns server-derived state for a specific domain or entity. It fetches data, exposes that data and mutation handlers through context, and wraps only the route subtree that needs it. Consumers anywhere inside that subtree access data through a typed hook without prop-drilling.

### Context type interface

Declares exactly what the provider exposes. Every field is typed; no `any`, no raw `data` objects.

```ts
// src/providers/tour-detail-provider.tsx
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

### Context with `null` default

The context is created with `null`, not a fake default. This ensures that calling outside the provider throws a clear error immediately, instead of silently returning stale or empty data.

```ts
const TourDetailContext = createContext<TourDetailContextType | null>(null);
```

### Typed consumer hook with guard

Consumers never call `useContext` directly. The exported hook centralises the `null` check.

```ts
export function useTourDetailContext() {
  const ctx = useContext(TourDetailContext);
  if (!ctx)
    throw new Error('useTourDetailContext must be used within TourDetailProvider');
  return ctx;
}
```

### Provider component

Owns the fetch and mutation lifecycle. Takes entity ID as a prop, wires `useFetchFn` and `useMutationFn`, and exposes handlers that include `onError` with `Alert.alert`.

```ts
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

### Provider tree — co-location

Each provider is placed at the closest layout that wraps all screens needing it.

```
src/app/_layout.tsx
  └── AuthProvider

src/app/(protected)/_layout.tsx
  └── AllOrganizationsProvider
       └── OrganizationProvider
            └── OwnerModeProvider

src/app/(protected)/organization/[organizationId]/_layout.tsx
  └── InvoiceTypeProvider

src/app/(protected)/tour-detail/[tourId]/_layout.tsx
  └── TourDetailProvider          ← route-scoped

src/app/(protected)/booking-detail/[bookingId]/index.tsx
  └── BookingDetailProvider       ← screen-scoped

src/app/(protected)/invoice-detail/[invoiceId].tsx
  └── InvoiceDetailProvider       ← screen-scoped

src/app/(protected)/project-detail/[projectId].tsx
  └── PersonalProjectDetailProvider | OrganizationProjectDetailProvider
```

### Provider variants

| Variant | Fetches data | Has mutations | Example |
|---------|:---:|:---:|---------|
| List provider | ✅ | ❌ | `OrganizationProvider`, `InvoiceTypeProvider` |
| Detail provider | ✅ | ✅ | `TourDetailProvider`, `BookingDetailProvider` |
| Auth provider | Special — login/logout/token lifecycle | `AuthProvider` |
| UI-only provider | ❌ | ❌ | `OwnerModeProvider` |

---

## Why

Without providers, screens must each individually fetch and manage the same data, handle loading states, wire mutation callbacks, and pass results down through props across multiple levels. This produces duplicated fetch logic, inconsistent loading/error handling, and screens tightly coupled to the API layer.

Providers centralise fetch ownership. A screen that needs a tour only calls `useTourDetailContext()` — it does not know how the tour is fetched, cached, or invalidated. When the fetch strategy changes (e.g., adding a new cache tag), it changes in one place.

Co-locating providers with routes (rather than hoisting everything to root) ensures that data is only fetched when the screens that need it are actually mounted.

---

## How

### Rule 1 — Context default is always `null`

Never provide a stub default. A `null` default means bad wiring is caught immediately as a thrown error, not silently swallowed.

### Rule 2 — Always export a typed consumer hook

Consumers call `useTourDetailContext()`, never `useContext(TourDetailContext)`. The hook is the public API; the context object is an implementation detail.

### Rule 3 — Providers own mutations; screens call handlers

The provider exposes `handleUpdateTour(fields, onSuccess?)`. The screen calls that handler. The screen does not import or call `updateTourApi` directly.

### Rule 4 — Every `useMutationFn` call must have `onError`

```ts
// ✅
updateTour(fields, {
  onSuccess: () => onSuccess?.(),
  onError: (error: ApiError) => Alert.alert('Lỗi', generateErrorMessage(error)),
});

// ❌ — silent failure
updateTour(fields, { onSuccess: () => onSuccess?.() });
```

### Rule 5 — `?? []` for lists, `?? undefined` for single entities

```ts
organizations: organizations ?? [],    // list — always an array, never null
tour: tour ?? undefined,               // single — undefined signals "not yet loaded"
```

### Rule 6 — Providers do not call `setIsNavigating`

Navigation loading is a UI concern. Remove any `useNavigationStore` imports from providers. The screen or layout that calls the mutation handler is responsible for toggling the navigation overlay.

### Rule 7 — Co-locate with the closest ancestor route

Do not hoist a detail provider to root just because it is convenient. Place it at the layout or screen file of the route that introduces the entity ID as a param.

### Adding a new detail provider

```ts
// 1. Define the context type
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

// 4. Implement provider with useFetchFn + useMutationFn
export function XxxDetailProvider({ xxxId, children }: { xxxId: string; children: React.ReactNode }) {
  // ... fetch + mutation wiring
  return <XxxDetailContext value={...}>{children}</XxxDetailContext>;
}

// 5. Co-locate in the route layout
// src/app/(protected)/xxx-detail/[xxxId]/_layout.tsx
```
