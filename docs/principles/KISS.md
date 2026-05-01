# KISS — Keep It Simple, Stupid

## What

Prefer the simplest solution that solves the actual problem. Complexity must earn its place. If a simpler approach works, it is correct.

In practice:
- Simple forms use `useState`, not a dedicated Zustand store.
- Fetch-and-display components use `useFetchFn`, not manual `useEffect` + `useState` + `fetch`.
- Providers expose only what consumers actually need.

### Fetch lifecycle in two lines

`useFetchFn` handles loading state, error state, caching, and tag-based invalidation. The manual equivalent — `useEffect` + `useState` + `fetch` — requires ~20 lines for the same result.

```ts
const { data: tours, isLoading, refreshFetchFn: refresh } =
  useFetchFn(() => getToursByOrganizationIdApi(orgId), {
    fetchKey: `org-tours-${orgId}`,
    tags: ['organization-tour-list'],
  });
```

### Error extraction

One utility call replaces fragile inline pattern matching.

```ts
// ✅
Alert.alert('Lỗi', generateErrorMessage(error));

// ❌ — duplicated, fragile
Alert.alert('Lỗi', error.message || error?.data?.message || 'Có lỗi xảy ra');
```

### File-based routing

No `Stack.Navigator` + `Screen` registration per route. Adding a screen means adding one file at the correct path in `src/app/`. Expo Router derives the route from the path automatically.

### Simple forms stay simple

`login.tsx` and `register.tsx` use plain `useState` for their 3–4 fields. The complexity does not justify a Zustand store or a form library.

```ts
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

## Why

Every line of code that is not required to solve the problem is a line that must be read, understood, tested, and maintained. Complexity compounds: a component that fetches, calculates, and renders is harder to test than one that only renders. Simple code fails in simple, obvious ways; complex code fails in subtle, unexpected ways.

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

5. **Use project utilities** (`generateErrorMessage`, `generateFilterQueryString`, `generateDateRange`) instead of re-implementing inline.
