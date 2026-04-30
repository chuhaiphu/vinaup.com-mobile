# Observer Pattern

## What

The observer pattern allows multiple components to subscribe to shared state and re-render automatically when that state changes, without prop-drilling and without coupling components to each other.

### Store

A Zustand store is a self-contained unit of state and the actions that modify it. It is created once at module level and lives as a singleton for the lifetime of the app.

```ts
// src/hooks/use-navigation-store.ts — simplest form
interface NavigationStore {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()((set) => ({
  isNavigating: false,
  setIsNavigating: (value) => set({ isNavigating: value }),
}));
```

### Subscriber

Any component subscribes by calling the store hook. It optionally passes a selector to subscribe to a specific slice, limiting re-renders to changes in that slice only.

```ts
// Subscribe to one field — re-renders only when isNavigating changes
const isNavigating = useNavigationStore((s) => s.isNavigating);

// Subscribe to an action — stable reference, never triggers a re-render
const setIsNavigating = useNavigationStore((s) => s.setIsNavigating);
```

### Three store variants in this codebase

#### Variant 1 — Simple store
Ephemeral state that resets when the app restarts. No middleware.

```ts
// use-navigation-store.ts
export const useNavigationStore = create<NavigationStore>()((set) => ({
  isNavigating: false,
  setIsNavigating: (value) => set({ isNavigating: value }),
}));
```

#### Variant 2 — Persisted store
User preferences that must survive app restarts. Uses `persist` middleware backed by AsyncStorage.

```ts
// use-organization-utility-store.ts
export const useOrganizationUtilitiesStore = create<OrganizationUtilitiesStore>()(
  persist(
    (set, get) => ({
      selections: {},
      getSelectedUtilities: (orgId) => get().selections[orgId] ?? [],
      toggleUtility: (orgId, key) =>
        set((state) => {
          const current    = state.selections[orgId] ?? [];
          const isSelected = current.includes(key);
          const updated    = isSelected ? current.filter((k) => k !== key) : [...current, key];
          return { selections: { ...state.selections, [orgId]: updated } };
        }),
      setUtilities:   (orgId, util) => set((state) => ({ selections: { ...state.selections, [orgId]: util } })),
      resetUtilities: (orgId) =>
        set((state) => {
          const next = { ...state.selections };
          delete next[orgId];
          return { selections: next };
        }),
    }),
    { name: STORAGE_KEYS.organizationUtilities, storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

#### Variant 3 — Complex store with `get()`
When an action needs to read current state across multiple fields before computing the next state (cross-field validation, derived values), use the `get` accessor.

```ts
// use-receipt-payment-form-store.ts
export const useReceiptPaymentFormStore = create<ReceiptPaymentFormStore>()(
  (set, get) => ({
    // ... fields and individual setters ...

    validateBeforeSave: () => {
      const { description, unitPrice } = get(); // ← reads current state of sibling fields
      const nextErrors = {
        description: !description.trim(),
        unitPrice:   Number(unitPrice) <= 0,
      };
      set({ inputErrors: nextErrors });
      return !nextErrors.description && !nextErrors.unitPrice;
    },
  })
);
```

### Clearing persisted stores on logout

```ts
// src/providers/auth-provider.tsx — performLogout()
usePersonalUtilitiesStore.persist.clearStorage();
useOrganizationUtilitiesStore.persist.clearStorage();
```

---

## Why

Modal open/close state, navigation loading, form fields, and user preferences all need to be accessible by components that are far apart in the tree, sometimes completely unrelated screens. Lifting this state and passing it down via props would produce chains of props through components that do not use them.

React Context solves the same problem but is better suited for server data with a fetch lifecycle (see Provider Pattern). For pure UI state that does not fetch anything and changes frequently, Zustand is lighter: it does not require a Provider wrapper, and persists to AsyncStorage with a single middleware line.

---

## How

### Rule 1 — Zustand is for UI and ephemeral state only

Do not store API responses in Zustand stores. Server data (entities fetched from the API) belongs in React Context providers.

### Rule 2 — Persist only user preferences

Use the `persist` middleware only for data that must survive app restarts: `useOrganizationUtilitiesStore` and `usePersonalUtilitiesStore`. Do not persist ephemeral state like navigation loading or form drafts.

### Rule 3 — Clear persisted stores on logout

Every persisted store must have its storage cleared in `performLogout` inside `auth-provider.tsx`. Forgetting this leaves stale data from the previous user session.

### Rule 4 — Use selective subscription to avoid unnecessary re-renders

```ts
// ✅ Component only re-renders when the selected slice changes
const isNavigating = useNavigationStore((s) => s.isNavigating);

// ❌ Component re-renders on any change to the entire store
const { isNavigating, setIsNavigating } = useNavigationStore();
```

### Rule 5 — Use `get()` only for cross-field logic

Reserve the `(set, get) => ({})` signature for stores where actions need to read the current value of sibling fields before computing a new state (e.g., `validateBeforeSave`). Simple field setters only need `set`.

### Adding a new simple store

```ts
// src/hooks/use-xxx-store.ts
interface XxxStore {
  value: string;
  setValue: (v: string) => void;
  reset: () => void;
}

export const useXxxStore = create<XxxStore>()((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
  reset:    ()  => set({ value: '' }),
}));
```
