# DRY — Don't Repeat Yourself

## What

Every piece of knowledge must have a single, unambiguous representation in the system. When logic, structure, or data must change, it should require modification in exactly one place.

### Named constants for shared values

Format strings, magic numbers, and color codes are defined once in `src/constants/` and imported wherever they are needed. All callers update automatically when the constant changes.

```ts
// src/constants/app-constant.ts
export const DD_MM_DATE_FORMAT_SHORT = 'DD/MM';

// every consumer imports the same constant
d.format(DD_MM_DATE_FORMAT_SHORT)              // receipt-payment-booking-list-content.tsx
start.format(DD_MM_DATE_FORMAT_SHORT)          // tour-detail-header-content.tsx
displayFormat={DD_MM_DATE_FORMAT_SHORT}        // DateTimePicker usages
```

### Shared utility functions

Logic that recurs in two or more call sites is extracted into `src/utils/`. A fix or spec change in the utility propagates to every caller automatically.

```ts
// src/utils/generator/string-generator/generate-date-range.ts
export function generateDateRange(start: string, end: string, format = DD_MM_DATE_FORMAT_SHORT): string {
  // single definition — used in project-card, invoice-card, tour-card
}
```

```ts
// src/utils/generator/string-generator/generate-filter-query-string.ts
export function generateFilterQueryString(filter?: DateFilterParam, extra?: Record<string, string | undefined>): string {
  // single definition — called from every paginated list API function
}
```

### Shared primitives layer

`Button`, `Input`, `Select`, `Modal`, `Loader`, and others are defined once in `src/components/primitives/` and reused across all domains. Touch handling, loading states, and styling live in one place.

### Interface-driven API typing

Request and response types are defined once in `src/interfaces/*-interfaces.ts` and shared between API functions, providers, and components — never redefined inline.

### Parameterised templates

When two modules share the same structure but differ in a few values, a single template function accepts those values as parameters.

```ts
// src/utils/generator/file-generator/html/generate-tour-cancel-log-html.ts — one definition
export function generateTourCancelLogHtml(input: TourCancelLogPdfHtmlInput, avatarBase64?: string): string { ... }

// two callers supply only what differs
generateTourCancelLogHtml({ ..., mainTitle: 'Tính giá',   summaryHeaderLabel: 'Dự kiến' }, b64)  // calculation
generateTourCancelLogHtml({ ..., mainTitle: 'Quyết toán', summaryHeaderLabel: 'Thực tế' }, b64)  // settlement
```

## Current Violations

- **Zustand utility stores** (`use-navigation-store`, `use-modal-store`, etc.) are structurally identical — each defines a single boolean flag + setter with the same shape — but defined separately. A generic `useBooleanStore` factory would eliminate the duplication.

## Why

When logic exists in one place, fixing a bug or updating behaviour requires touching exactly one file — and TypeScript propagates the change to every caller automatically. When the same decision is duplicated across files, a change requires finding every copy. The more copies exist, the harder it is to be certain that a change is complete.

---

## How

1. **Extract when the same decision appears in 2+ places** — not just similar code, but identical logic.
2. **Utility functions belong in `src/utils/`** — not defined inline inside components or providers.
3. **Constants belong in `src/constants/`** — format strings, magic numbers, color codes.
4. **Shared components belong in `src/components/commons/` or `src/components/primitives/`** — not copy-pasted across domain folders.
5. **Do not DRY prematurely** — wait until the same thing appears at least twice before extracting.
