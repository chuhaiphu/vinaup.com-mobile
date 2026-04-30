# Factory Pattern

## Intent

Encapsulate object/store creation behind a single function so that all instances share the same base structure while allowing per-instance extensions.

---

## Where It Is Used

### 1. `createModalStore` — Zustand Modal Store Factory

**File:** `src/hooks/use-modal-store.ts`

All CRUD modals in the app share the same lifecycle: a modal can be in `create`, `update`, or `delete` mode, carries an `editingId`, and exposes four standard actions. Instead of copy-pasting this logic into every store, a factory function produces correctly typed Zustand stores on demand.

```ts
// src/interfaces/store-interfaces.ts
export interface ModalStore {
  isOpen: boolean;
  editingId: string;
  mode: 'create' | 'update' | 'delete';
  setCreateMode: () => void;
  setEditMode: (id: string) => void;
  setDeleteMode: (id: string) => void;
  closeModal: () => void;
}

// src/hooks/use-modal-store.ts
function createModalStore<T extends ModalStore>(
  overrides?: (set: StoreApi<T>['setState']) => Partial<T>
) {
  return create<T>((set) => ({
    isOpen: false,
    mode: 'create',
    editingId: '',
    setCreateMode: () => set({ isOpen: true, mode: 'create', editingId: '' } as Partial<T>),
    setEditMode:   (id) => set({ isOpen: true, mode: 'update', editingId: id } as Partial<T>),
    setDeleteMode: (id) => set({ isOpen: false, mode: 'delete', editingId: id } as Partial<T>),
    closeModal:    ()   => set({ isOpen: false, editingId: '' } as Partial<T>),
    ...(overrides ? overrides(set) : {}),
  }) as T);
}
```

**Concrete instances — plain stores (no extensions):**
```ts
export const useOrganizationCustomerModalStore = createModalStore();
export const useOrganizationMemberModalStore   = createModalStore();
export const useOrganizationModalStore         = createModalStore();
export const useProjectModalStore              = createModalStore();
export const useInvoiceModalStore              = createModalStore();
export const useTourModalStore                 = createModalStore();
export const useBookingModalStore              = createModalStore();
export const useCarModalStore                  = createModalStore();
```

**Extended instance — adds domain-specific fields via `overrides`:**
```ts
interface ReceiptPaymentModalStore extends ModalStore {
  preselectedDate?: Date;
  setPreselectedDate: (d: Date) => void;
}

export const useReceiptPaymentModalStore =
  createModalStore<ReceiptPaymentModalStore>((set) => ({
    preselectedDate: undefined,
    setPreselectedDate: (date) => set({ preselectedDate: date }),
  }));
```

---

## How to Use

### Standard modal (no extensions)
```ts
const { isOpen, mode, editingId, setCreateMode, setEditMode, setDeleteMode, closeModal } =
  useProjectModalStore();
```

### Extended modal
```ts
const { isOpen, mode, preselectedDate, setCreateMode, setPreselectedDate, closeModal } =
  useReceiptPaymentModalStore();
```

---

## Rules

1. **Every CRUD modal must be created via `createModalStore`** — never use `create<T>()` directly for modal state.
2. **Domain-specific state is added via the `overrides` parameter** — extend `ModalStore` interface, pass extra fields in the callback.
3. **`ModalStore` interface is the contract** — do not remove or rename any of the 7 base members.
4. **One store per domain** — `useTourModalStore` handles all tour modals; do not create `useTourCreateModalStore` and `useTourDeleteModalStore` separately.

---

## Adding a New Modal Store

```ts
// 1. Plain store — nothing beyond the base interface
export const useXxxModalStore = createModalStore();

// 2. Extended store — domain needs extra fields
interface XxxModalStore extends ModalStore {
  selectedType: string;
  setSelectedType: (v: string) => void;
}
export const useXxxModalStore = createModalStore<XxxModalStore>((set) => ({
  selectedType: '',
  setSelectedType: (v) => set({ selectedType: v }),
}));
```
