# Observer Pattern

## Intent

Allow multiple components to subscribe to shared state and re-render automatically when that state changes — without prop-drilling and without a full Redux-style setup. Zustand implements this via its internal pub-sub mechanism.

---

## Where It Is Used

All files in `src/hooks/` that use `create` from Zustand. Three distinct store variants exist:

| Store | File | Variant |
|-------|------|---------|
| `useNavigationStore` | `use-navigation-store.ts` | Simple — no middleware |
| `useOrganizationUtilitiesStore` | `use-organization-utility-store.ts` | Persisted — survives app restarts |
| `usePersonalUtilitiesStore` | `use-personal-utility-store.ts` | Persisted — survives app restarts |
| `useReceiptPaymentFormStore` | `use-receipt-payment-form-store.ts` | Complex — uses `get()` for cross-field logic |
| Modal stores (×9) | `use-modal-store.ts` | Factory-created — see Factory Pattern |

---

## Variant 1: Simple Store

Used for ephemeral UI state that does not need to survive navigation or app restart.

```ts
// src/hooks/use-navigation-store.ts
interface NavigationStore {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()((set) => ({
  isNavigating: false,
  setIsNavigating: (value) => set({ isNavigating: value }),
}));
```

**Consumer:**
```ts
// Any component, anywhere in the tree — no Provider wrapper needed
const { isNavigating, setIsNavigating } = useNavigationStore();
```

---

## Variant 2: Persisted Store

Used for user preferences that must survive app restarts. Backed by AsyncStorage.

```ts
// src/hooks/use-organization-utility-store.ts
export const useOrganizationUtilitiesStore = create<OrganizationUtilitiesStore>()(
  persist(
    (set, get) => ({
      selections: {},
      getSelectedUtilities: (orgId) => get().selections[orgId] ?? [],
      toggleUtility: (orgId, key) =>
        set((state) => {
          const current   = state.selections[orgId] ?? [];
          const isSelected = current.includes(key);
          const updated   = isSelected ? current.filter((k) => k !== key) : [...current, key];
          return { selections: { ...state.selections, [orgId]: updated } };
        }),
      setUtilities:   (orgId, utilities) => set((state) => ({ selections: { ...state.selections, [orgId]: utilities } })),
      resetUtilities: (orgId) =>
        set((state) => {
          const next = { ...state.selections };
          delete next[orgId];
          return { selections: next };
        }),
    }),
    {
      name:    STORAGE_KEYS.organizationUtilities,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Clearing on logout:**
```ts
// src/providers/auth-provider.tsx — performLogout()
usePersonalUtilitiesStore.persist.clearStorage();
useOrganizationUtilitiesStore.persist.clearStorage();
```

---

## Variant 3: Complex Store (uses `get()`)

Used when actions need to read current state of other fields before computing new state.

```ts
// src/hooks/use-receipt-payment-form-store.ts
export const useReceiptPaymentFormStore = create<ReceiptPaymentFormStore>()(
  (set, get) => ({
    // ... fields and setters ...

    validateBeforeSave: () => {
      const { description, unitPrice } = get(); // ← cross-field read
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

---

## Selective Subscription (performance)

Components subscribe only to the slice they need:

```ts
// Subscribe to one field — only re-renders when isNavigating changes
const isNavigating = useNavigationStore((state) => state.isNavigating);

// Subscribe to action only — never re-renders (actions are stable references)
const setIsNavigating = useNavigationStore((state) => state.setIsNavigating);
```

---

## Rules

1. **Zustand stores are for UI / ephemeral state only** — server data (fetched from API) belongs in React Context providers.
2. **Do not store server responses in Zustand** — use providers + `useFetchFn` for that.
3. **Use `persist` middleware only for user preferences** — form drafts that need to survive sessions, utility selections tied to org/personal mode.
4. **Clear persisted stores on logout** — call `.persist.clearStorage()` for every persisted store in `performLogout`.
5. **Prefer selective subscription** (`useStore((s) => s.field)`) over full store destructuring to avoid unnecessary re-renders.
6. **Modal stores use the Factory Pattern** — never define modal state manually with `create`.
