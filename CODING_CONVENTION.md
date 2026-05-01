# Coding Conventions — VinaUp Mobile

## 1. Folder Structure

Type-based organization. Files are grouped by their technical role, not by business domain.

```
src/
├── app/              # Expo Router screens (file-based routing)
├── apis/             # All API call functions (*-apis.ts)
├── components/
│   ├── primitives/   # Base UI atoms (Button, Input, Modal, Loader...)
│   ├── icons/        # Custom SVG icon components
│   ├── commons/      # Cross-domain shared components (cards, headers, modals, skeletons)
│   ├── organization/ # Org-mode domain components (by feature subfolder)
│   └── personal/     # Personal-mode domain components (by feature subfolder)
├── constants/        # Enums and constant values (*-constants.ts)
├── hooks/            # Zustand stores (use-*-store.ts)
├── interfaces/       # TypeScript types and interfaces (*-interfaces.ts)
├── providers/        # React Context providers (*-provider.tsx)
└── utils/
    ├── calculator/        # Pure calculation functions
    └── generator/
        ├── string-generator/   # String & value generators
        └── file-generator/
            └── pdf/            # PDF document generators
```

No barrel files (`index.ts`). Always import by full path:
```ts
// ✅
import { Button } from '@/components/primitives/button'
// ❌
import { Button } from '@/components/primitives'
```

---

## 2. Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Files | kebab-case | `tour-detail-provider.tsx` |
| Components | PascalCase | `TourDetailCard` |
| Component props interface | `{Name}Props` | `TourDetailCardProps` |
| API functions | camelCase + `Api` suffix | `getTourByIdApi()` |
| Custom hooks / stores | camelCase + `use` prefix | `useModalStore` |
| Context hooks | `use{Name}Context` | `useTourDetailContext` |
| Constants objects | UPPER_SNAKE_CASE | `DOCUMENT_TYPES` |
| Types from const | PascalCase | `DocumentType` |
| Interface files | `*-interfaces.ts` | `tour-interfaces.ts` |
| Constant files | `*-constants.ts` | `tour-constants.ts` |
| API files | `*-apis.ts` | `tour-apis.ts` |

---

## 3. State Management Rules

### Use React Context for server state
- Data fetched from the API that needs to be shared deeply across multiple screens
- Entity details scoped to a route (TourDetailProvider, BookingDetailProvider...)
- Auth state, organization list, org selection

### Use Zustand stores for UI / ephemeral state
- Modal open/close state
- Form field values for complex forms
- Navigation loading overlay
- Per-org/per-personal utility selections (persisted to AsyncStorage)

**Rules:**
- Do NOT put UI state in Context
- Do NOT put server data in Zustand stores
- Zustand stores live in `src/hooks/use-*-store.ts`

### Provider co-location
Providers must be placed in the closest route layout that wraps all screens needing them:

```
src/app/
├── _layout.tsx                              → AuthProvider
├── (protected)/
│   ├── _layout.tsx                          → AllOrganizationsProvider, OrganizationProvider, OwnerModeProvider
│   └── organization/[organizationId]/
│       ├── _layout.tsx                      → InvoiceTypeProvider
│       └── (tabs)/_layout.tsx               → tab navigation only
```

Detail providers (TourDetailProvider, BookingDetailProvider, etc.) are co-located in their respective screen file or `_layout.tsx`.

---

## 4. Form Handling Rules

- **≤ 3 fields + simple validation** → `useState`
  - Login, register, simple filter dialogs
- **≥ 4 fields OR complex validation** → Zustand store
  - Receipt-payment form, tour forms
- Validation logic must be pure functions, placed in `src/utils/validators/` (separate from the store)

---

## 5. Error Handling

### API errors
```ts
import { generateErrorMessage } from '@/utils/generator/string-generator/generate-error-message'

// In providers and screens:
Alert.alert('Lỗi', generateErrorMessage(error))
```

Do NOT manually access `error.message` directly — always use `generateErrorMessage()` to safely extract the message from any error shape.

### Unexpected crashes
An `ErrorBoundary` wraps the entire app at `src/app/_layout.tsx`. It catches unexpected JS errors in the render tree.

---

## 6. Import Order

Enforced by ESLint (`eslint-plugin-import`). Groups separated by a blank line:

```ts
// 1. React / React Native core
import React from 'react'
import { View, Text } from 'react-native'

// 2. External packages
import { useRouter } from 'expo-router'
import dayjs from 'dayjs'
import { useMutationFn } from 'fetchwire'

// 3. Internal absolute (@/)
import { getTourByIdApi } from '@/apis/tour-apis'
import { Button } from '@/components/primitives/button'
import { useTourDetailContext } from '@/providers/tour-detail-provider'

// 4. Relative
import { TourInfoSection } from './tour-info-section'
```

Run `npx eslint src/ --fix` to auto-fix ordering.

---

## 7. Component Splitting

Split a component into sub-components when it has more than one clear responsibility — not based on line count alone.

Common patterns:
- Modal: `confirm-modal.tsx` (shell + trigger) + `confirm-modal-content.tsx` (form/UI logic)
- Screen: `tour-detail-screen.tsx` + `tour-detail-header.tsx` + `tour-detail-info-section.tsx`
- Long list screens: `*-list-section.tsx` → `*-list-section-content.tsx` (for Suspense/lazy)

---

## 8. TypeScript

- `strict: true` is enabled — no `any` types
- All component props must have an explicit interface (`interface {Name}Props`)
- API response types use generics: `wireApi<TourResponse>(...)`
- Request types use `Partial<CreateRequest> & { ... }` for update shapes
- All interfaces live in `src/interfaces/*-interfaces.ts`

---

## 9. API Layer

Each domain has one file in `src/apis/*-apis.ts`. Functions are named `{verb}{Entity}Api`:

```ts
export async function getTourByIdApi(id: string) { ... }
export async function createTourApi(data: CreateTourRequest) { ... }
export async function updateTourApi(id: string, data: UpdateTourRequest) { ... }
export async function deleteTourApi(id: string) { ... }
```

Use `generateFilterQueryString(filter, extra)` from `@/utils/generator/string-generator/generate-filter-query-string` for query param building.
