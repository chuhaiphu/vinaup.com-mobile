# Composite Pattern

## What

The composite pattern builds complex components by assembling smaller, single-purpose pieces. Each piece has exactly one job; the parent assembles them.

### Level 1 — Primitive extension

A primitive is a React Native base component wrapped to add exactly one project-specific behaviour. All original props pass through unchanged via spread operator.

```ts
// src/components/primitives/button.tsx
// Concern added: loading state (shows ActivityIndicator, disables touch while loading)
// Everything else: unchanged from PressableProps

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

The wrapping hierarchy is: `Pressable` → `PressableOpacity` (adds opacity feedback) → `Button` (adds loading state). Each step adds one concern.

### Level 2 — Modal shell and content

Every modal is split across two files in the same folder:

| File | Concern |
|------|---------|
| `*-modal.tsx` | Container lifecycle: holds the `SlideSheet` or `Modal` ref, exposes `open`/`close`, passes `onClose` callback to content |
| `*-modal-content.tsx` | UI and interactions: form fields, list rendering, confirm/cancel buttons, local selection state |

```ts
// src/components/commons/modals/signer-select-modal/signer-select-modal.tsx
// SHELL — owns the SlideSheet container and produces the close callback
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
// CONTENT — owns selection state, list rendering, confirm/cancel actions
export function SignerSelectModalContent({ organizationMembers, receiverSignatures, isLoading, onClose, onConfirm }) {
  // local selection state, list JSX, button handlers
}
```

### Folder convention

```
components/commons/modals/
└── {name}-modal/
    ├── {name}-modal.tsx          ← shell
    └── {name}-modal-content.tsx  ← content

components/organization/{domain}/modals/
└── {name}-modal/
    ├── {name}-modal.tsx
    ├── {name}-modal-content.tsx
    └── {name}-real-list.tsx      ← optional: paginated or virtual list inside the modal
```

---

## Why

A single-file modal that owns its container, renders its form, manages selection state, fetches data, and calls callbacks quickly grows three or four unrelated concerns tangled together. A change to the container type (e.g., `SlideSheet` → `BottomSheet`) forces reading through the entire form logic to find the two lines that need to change.

Splitting into shell and content makes both files smaller and independently comprehensible. The shell is changed when the container type changes. The content is changed when the form or list logic changes. Neither file needs to understand the other's internals — only the props interface between them matters.

The same reasoning applies to primitive extension. A raw `Pressable` that also manages loading state and opacity feedback in the same component grows multiple concerns.

---

## How

### Rule 1 — Every non-trivial modal must be split into shell and content

A modal that has both container wiring and form/list logic must be in two files. There are no single-file modals above that threshold.

### Rule 2 — Shell produces `onClose`; content consumes it

The content component never accesses `modalRef` directly. It receives `onClose: () => void` as a prop and calls it when the user cancels or after a successful confirm.

```ts
// ✅
<SignerSelectModalContent onClose={handleClose} onConfirm={onConfirm} ... />

// ❌
<SignerSelectModalContent modalRef={modalRef} ... />
// content then calls: modalRef.current?.close() — couples content to container type
```

### Rule 3 — Content receives data as props; it does not fetch

The parent provider or screen fetches the data passes it down. The content component renders what it receives. This keeps content testable without mocking API calls.

```ts
// ✅ — parent fetches, content renders
<SignerSelectModalContent
  organizationMembers={organizationMembers}  // passed from parent
  receiverSignatures={receiverSignatures}
  ...
/>

// ❌ — content fetches its own data
function SignerSelectModalContent() {
  const { data: members } = useFetchFn(() => getMembersApi(), { ... });
  ...
}
```

### Rule 4 — Primitive wrappers always spread base props

```ts
// ✅
export function Button({ isLoading, children, ...props }: ButtonProps) {
  return <PressableOpacity {...props} disabled={isLoading || props.disabled}>...</PressableOpacity>;
}

// ❌ — silently drops accessibility props, testID, style, etc.
export function Button({ isLoading, onPress, style }: ButtonProps) {
  return <PressableOpacity onPress={onPress} style={style}>...</PressableOpacity>;
}
```

### Adding a new modal

```
components/{scope}/modals/
└── my-feature-modal/
    ├── my-feature-modal.tsx          ← SlideSheet + ref wiring + onClose
    └── my-feature-modal-content.tsx  ← form fields, buttons, local state
```

```ts
// my-feature-modal.tsx
export function MyFeatureModal({ modalRef, onConfirm, data }: MyFeatureModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <MyFeatureModalContent
        data={data}
        onClose={() => modalRef.current?.close()}
        onConfirm={onConfirm}
      />
    </SlideSheet>
  );
}
```
