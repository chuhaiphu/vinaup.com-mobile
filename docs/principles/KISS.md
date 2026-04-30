# KISS — Keep It Simple, Stupid

## What

Prefer the simplest solution that solves the actual problem. Complexity must earn its place. If a simpler approach works, it is correct. Complexity introduced before it is needed is debt, not investment.

In practice:
- Simple forms use `useState`, not a dedicated Zustand store.
- Fetch-and-display components use `useFetchFn`, not manual `useEffect` + `useState` + `fetch`.
- Providers expose only what consumers actually need.

### ✅ Done well

**`fetchwire` hooks eliminate fetch boilerplate**
Instead of managing `isLoading`, `data`, `error`, and `useEffect` manually for every API call, the codebase uses `useFetchFn` (read) and `useMutationFn` (write). A list fetch is two lines:
```ts
const { data: tours, isLoading, refreshFetchFn: refresh } =
  useFetchFn(() => getToursByOrganizationIdApi(orgId), { fetchKey: `...`, tags: [...] });
```

**Expo Router file-based routing**
No manual `Stack.Navigator` + `Screen` registration for every route. The file path IS the route. Adding a new screen means adding one file.

**`generateErrorMessage` for error extraction**
One call replaces fragile pattern-matching everywhere:
```ts
Alert.alert('Lỗi', generateErrorMessage(error));
// instead of: error.message || error?.data?.message || 'Có lỗi xảy ra'
```

**Simple forms stay simple**
Login (`login.tsx`) and register (`register.tsx`) use plain `useState` — three fields, no library, no store. The form complexity does not justify more infrastructure.

### ❌ Current violations

**Card components are unnecessarily complex**

`src/components/commons/cards/project-card.tsx` and `invoice-card.tsx` each do:
1. Own API data fetching (`useFetchFn`)
2. Run a financial calculation on the fetched data
3. Render the card UI
4. Manage a `isShowingPrice` toggle state

A card component's only job is to display data it receives as props. Everything else is complexity that does not belong here.

**Simpler approach:** The parent list screen or list component fetches receipt payments once and passes the pre-calculated total as a prop to each card. The card renders a prop — one job, zero fetches.

---

**`TourDetailLayout` handles too many concerns**

`src/app/(protected)/tour-detail/[tourId]/_layout.tsx` (212 lines) manages:
- Route param extraction (`useLocalSearchParams` called twice — in both parent and child)
- Delete mutation wiring + Alert dialog
- Save-and-exit navigation logic
- Status select dropdown state
- Tab list rendering
- Layout/styles

**Simpler approach:** Extract `useTourDelete(tourId)` hook for the delete flow. The layout becomes: "render header + slot + action bar", nothing more.

---

**`useLocalSearchParams` called in both parent and child of the same layout**

`src/app/(protected)/tour-detail/[tourId]/_layout.tsx`:
```ts
// Inside TourDetailLayoutContent (child)
const { tourId } = useLocalSearchParams<{ tourId: string }>();

// Inside TourDetailLayout (parent)
const { tourId } = useLocalSearchParams<{ tourId: string }>();
```

The child can simply receive `tourId` as a prop from the parent. Two hook calls for the same value is needless complexity.

---

**Hardcoded color values inside component files**

`src/components/primitives/select.tsx` lines 105, 206, 242:
```ts
color: '#333'
color: '#444'
borderColor: '#EEE'
```

These are design tokens that belong in `src/constants/style-constant.ts`. Using raw hex strings inside component files means changing the color requires a file-by-file search instead of editing one constant.

---

## Why

Every line of code that is not required to solve the problem is a line that must be read, understood, tested, and maintained. Complexity compounds: a component that fetches, calculates, and renders is harder to test than one that only renders. A layout that manages five concerns is harder to change than one that manages one. Simple code fails in simple, obvious ways; complex code fails in subtle, unexpected ways.

---

## How

1. **Choose the simplest state mechanism that works:**
   - Pure display → no state, just props
   - Toggle / transient UI → `useState`
   - Complex form (≥ 4 fields, validation) → Zustand store
   - Server data shared across screens → React Context + `useFetchFn`

2. **Do not add abstractions before they are needed** — extract when the complexity exists, not when it might.

3. **Components receive data as props, they do not fetch it** — except for container components explicitly designed to fetch.

4. **Avoid reading the same value twice** — pass it as a prop instead of calling the same hook in parent and child.

5. **Use project utilities** (`generateErrorMessage`, `buildFilterQueryString`, `formatDateRange`) instead of re-implementing inline.
