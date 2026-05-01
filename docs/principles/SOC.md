# Separation of Concerns (SoC)

## What

Each unit of code — file, function, component, or layer — should have one clearly defined concern. A concern is a distinct aspect of the system's behaviour: fetching data, rendering UI, managing state, defining types, or handling business logic. When concerns are mixed, a change in one area requires understanding and touching unrelated code.

### Layer Separation

The codebase is organized into four layers. Dependencies only point **inward** — outer layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────────┐
│  UI Layer                               │  screens, components
│  src/app/, src/components/             │
├─────────────────────────────────────────┤
│  State Layer                            │  server state + UI state
│  src/providers/, src/hooks/            │
├─────────────────────────────────────────┤
│  API Layer                              │  HTTP transport adapters
│  src/apis/                             │
├─────────────────────────────────────────┤
│  Core Layer                             │  types, constants, pure utils
│  src/interfaces/, src/constants/,      │
│  src/utils/                            │
└─────────────────────────────────────────┘
```

#### Core Layer — zero external dependencies
`src/interfaces/`, `src/constants/`, `src/utils/` contain only TypeScript types, enums, and pure functions. No React, no Expo, no `fetchwire`. These files may import from each other but from nothing above.

#### API Layer — HTTP adapters only
`src/apis/` translates typed Core objects into HTTP calls and back. Functions take Core types as input, return Core types as output. They never import from providers, hooks, or components.

```ts
// src/apis/tour-apis.ts
export async function getToursByOrganizationIdApi(
  organizationId: string,
  filter: TourFilterRequest
): Promise<TourResponse[]> { ... }
```

#### State Layer — lifecycle bridges
`src/providers/` owns server-state fetch/mutation lifecycle via `useFetchFn` / `useMutationFn`. `src/hooks/` owns ephemeral UI state via Zustand. Neither imports from `src/components/` or `src/app/`.

```ts
// src/providers/tour-detail-provider.tsx
// Owns: fetch, mutation, cache invalidation, error alerts
// Does NOT own: navigation loading overlay (that is a UI concern)
export function TourDetailProvider({ tourId, children }: { tourId: string; children: React.ReactNode }) {
  const { data: tour, ... } = useFetchFn(() => getTourByIdApi(tourId), { ... });
  const { executeMutationFn: updateTour, ... } = useMutationFn(...);
  // ...
}
```

#### UI Layer — render only
`src/components/` and `src/app/` render. They consume state via context hooks and Zustand selectors. They do not call `wireApi` directly. They do not define business logic.

```ts
// screen consumes context — does not import API functions directly
const { tour, handleUpdateTour } = useTourDetailContext();
```

---

### Concern Boundaries Within Layers

#### Component concerns
| Concern | Where it lives |
|---------|---------------|
| Render structure | Component JSX |
| Touch / interaction handling | Component event handlers |
| Local toggle state | `useState` inside component |
| Data fetching | Provider or parent container — never inside a card/list-item component |
| Business calculations | `src/utils/calculator-helpers.ts` |
| Navigation on user action | Component calls `router.push`, sets `isNavigating` |

#### Provider concerns
| Concern | Where it lives |
|---------|---------------|
| Fetch data from API | Provider — `useFetchFn` |
| Mutate data via API | Provider — `useMutationFn` with typed handlers |
| Invalidate cache | Provider — `invalidatesTags` in mutation config |
| Show error to user | Provider — `Alert.alert` in `onError` callback |
| Navigation loading overlay | **Screen / layout component** — NOT the provider |

---

### Current Adherence

**Layer boundaries are mostly respected**

Screens consume providers via `useXxxContext()` — they never import API functions directly (with one known exception below). Providers are the only bridge between `src/apis/` and the UI. `src/interfaces/` contains no React or library imports.

**Modal shell + content separation**

All modals are split into a container file (`*-modal.tsx`) and a content file (`*-modal-content.tsx`). Container owns lifecycle; content owns UI. See `docs/pattern/COMPOSITE-PATTERN.md`.

**Zustand vs Context separation**

Zustand stores handle UI/ephemeral state (navigation loading, form fields, preferences). React Context handles server state (fetched entities). These concerns are not mixed. See `docs/pattern/OBSERVER-PATTERN.md` and `docs/pattern/PROVIDER-PATTERN.md`.

---

## Why

When concerns are mixed, every change has a wider blast radius. Editing a card's rendering logic risks breaking its fetch logic. Editing a provider's mutation handler risks breaking navigation state. Mixing concerns also makes code harder to test: a component that fetches, calculates, and renders requires a full network setup to test a simple visual change.

Layers enforce a dependency direction that keeps each part of the system independently changeable. The API layer can change its URLs without touching providers. Providers can change their cache strategy without touching screens. Screens can change their layout without touching providers.

---

## How

### Layer Import Rules

| From ↓ \ To → | interfaces | constants | utils | apis | providers | hooks | components | app |
|----------------|:----------:|:---------:|:-----:|:----:|:---------:|:-----:|:----------:|:---:|
| **interfaces** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **constants** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **utils** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **apis** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **providers** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **hooks** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **components** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| **app** | ✅ | ✅ | ✅ | ⚠️† | ✅ | ✅ | ✅ | ✅ |

† Layout files may pass an API function reference to `useMutationFn` — acceptable only when no provider exists for that operation.
