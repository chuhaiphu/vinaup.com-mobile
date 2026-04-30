# Composite Pattern

## Intent

Build complex UI components by composing smaller, single-purpose pieces. A "shell" component owns structure and lifecycle; a "content" component owns visual logic and interactions. Neither knows about the other's internals.

---

## Where It Is Used

Two levels of composition exist in this codebase:

---

## Level 1: Primitive Extension

Base React Native components are extended with project-specific behaviour via wrapping.

### `Button` extends `Pressable`

```ts
// src/components/primitives/button.tsx
interface ButtonProps extends PressableProps {
  isLoading?: boolean;
  loaderStyle?: { color?: string; size?: 'small' | 'large' | number };
}

export function Button({ isLoading, children, disabled, loaderStyle, ...props }: ButtonProps) {
  return (
    <PressableOpacity {...props} disabled={isLoading || disabled}>
      {isLoading
        ? <ActivityIndicator size={loaderStyle?.size || 'small'} color={loaderStyle?.color || COLORS.vinaupTeal} />
        : children}
    </PressableOpacity>
  );
}
```

`Button` adds a loading state on top of `Pressable` without duplicating any touch handling logic. All original `PressableProps` pass through via `...props`.

---

## Level 2: Modal Shell + Content Split

Every modal is split into two files:

| File | Responsibility |
|------|---------------|
| `*-modal.tsx` | Owns the container/sheet lifecycle (open, close, animation ref) |
| `*-modal-content.tsx` | Owns the UI — form fields, list rendering, confirm buttons |

```ts
// src/components/commons/modals/signer-select-modal/signer-select-modal.tsx
// Shell — manages the SlideSheet container and close handler
export function SignerSelectModal({ modalRef, onConfirm, organizationMembers, receiverSignatures, isLoading }: SignerSelectModalProps) {
  const handleClose = () => modalRef.current?.close();
  return (
    <SlideSheet ref={modalRef}>
      <SignerSelectModalContent
        isLoading={isLoading}
        organizationMembers={organizationMembers}
        receiverSignatures={receiverSignatures}
        onClose={handleClose}
        onConfirm={onConfirm}
      />
    </SlideSheet>
  );
}

// src/components/commons/modals/signer-select-modal/signer-select-modal-content.tsx
// Content — manages selection state, renders list, emits callbacks
export function SignerSelectModalContent({ organizationMembers, receiverSignatures, isLoading, onClose, onConfirm }) {
  // selection state, list rendering, confirm/cancel buttons
}
```

**Why split?**
- Shell can be swapped (e.g., `SlideSheet` → `BottomSheet`) without touching the content.
- Content can be tested in isolation by mounting it directly without a modal container.
- Neither component grows beyond a single responsibility.

---

## File & Folder Convention

```
components/commons/modals/
└── {name}-modal/
    ├── {name}-modal.tsx          ← shell (container, ref, lifecycle)
    └── {name}-modal-content.tsx  ← content (form, list, actions)

components/organization/{domain}/modals/
└── {name}-modal/
    ├── {name}-modal.tsx
    └── {name}-modal-content.tsx
```

Complex modals with a search list add a third file:
```
└── {name}-modal/
    ├── {name}-modal.tsx
    ├── {name}-modal-content.tsx
    └── {name}-real-list.tsx      ← paginated/virtual list component
```

---

## Rules

1. **Every modal must be split into shell + content** — no single-file modals above 100 lines.
2. **Shell passes `onClose` as a callback to content** — content never accesses `modalRef` directly.
3. **Content receives data as props** — it does not fetch data; the parent or provider is responsible for fetching.
4. **Primitive components spread their base props** (`...props`) — never swallow props that the underlying component would accept.
5. **Split a component into sub-components when it has more than one clear responsibility** — not based on line count.
