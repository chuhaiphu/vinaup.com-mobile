# DRY — Don't Repeat Yourself

## Principle

Every piece of knowledge must have a single, unambiguous representation in the system. When logic, structure, or data must change, it should require modification in exactly one place.

DRY does not mean "never write similar code". It means "never duplicate decisions". Incidental structural similarity is not a DRY violation. Identical business logic copied across files is.

---

## How the Codebase Applies DRY

### ✅ Done well

**1. `createModalStore` factory**
All modal stores share the same `isOpen / mode / editingId` lifecycle. Instead of copy-pasting this into each domain, the logic lives once in `createModalStore()`. See `FACTORY-PATTERN.md`.

**2. `buildFilterQueryString` utility**
Every paginated list endpoint needs date range + extra filter params in the query string. This logic is written once in `src/utils/api-helpers.ts` and called from every relevant API function.

**3. Shared primitives layer**
`Button`, `Input`, `Select`, `Modal`, `Loader`, etc. are defined once in `src/components/primitives/` and reused across all domains. Touch handling, loading states, and styling live in one place.

**4. Interface-driven API typing**
Request and response types are defined once in `src/interfaces/*-interfaces.ts` and shared between API functions, providers, and components — never redefined inline.

---

## Where DRY Is Currently Violated

### ❌ Copy-pasted `*-real-list.tsx` components

**Files:**
```
src/components/organization/invoice/modals/invoice-org-customer-select-modal/invoice-org-customer-real-list.tsx
src/components/organization/tour/modals/tour-org-customer-select-modal/tour-org-customer-real-list.tsx
src/components/organization/project/modals/organization-project-org-customer-select-modal/organization-project-org-customer-real-list.tsx
```

~116 lines each, identical logic. The only variable is the fetch key prefix. See `docs/pattern/TODO.md` for the fix.

---

### ❌ `formatDateRange` logic duplicated in three card components

The same function body appears in `project-card.tsx`, `invoice-card.tsx`, and `tour-card.tsx`:

```ts
// Repeated identically in three files
const getDateRangeText = () => {
  if (dayjs(startDate).format('DD/MM') === dayjs(endDate).format('DD/MM'))
    return dayjs(startDate).format('DD/MM');
  return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
};
```

**Fix:** Add `formatDateRange(start: string, end: string): string` to `src/utils/generator-helpers.ts` and import it from the three card files.

---

### ❌ Receipt payment prefetch pattern duplicated in card components

`project-card.tsx` and `invoice-card.tsx` both contain:
```ts
const { data: receiptPayments, executeFetchFn: fetchReceiptPayments } = useFetchFn(
  () => getReceiptPaymentsByXxxIdApi(id),
  { fetchKey: `receipt-payment-list-in-xxx-${id}`, tags: [...] }
);
useEffect(() => { if (id) fetchReceiptPayments(); }, [id, fetchReceiptPayments]);
```

**Fix:** Extract a shared custom hook or lift this fetching to the parent list screen that passes pre-fetched data down as props.

---

### ❌ Two PDF generator files (~664 lines each) share 95% of their code

`src/utils/tour-calculation-cancel-log-pdf.ts` and `src/utils/tour-settlement-cancel-log-pdf.ts` duplicate `escapeHtml`, `formatDateTime`, `buildReceiptPaymentRows`, the full CSS block, and most of the HTML template structure.

**Fix:**
1. Create `src/utils/tour-pdf-helpers.ts` with all shared functions.
2. Keep only the domain-specific HTML sections in each original file.
3. Both files import from `tour-pdf-helpers.ts`.

---

### ❌ Date format string `'DD/MM'` as a magic string repeated ~8 times

Same literal appears in `project-card.tsx`, `invoice-card.tsx`, `tour-card.tsx`, `booking-card.tsx`, and inside the `formatDateRange` calls.

**Fix:** Define `const DATE_FORMAT_SHORT = 'DD/MM'` in `src/constants/app-constant.ts` and reference it everywhere.

---

### ❌ Zustand utility stores are structurally identical

`use-organization-utility-store.ts` and `use-personal-utility-store.ts` implement the same `selections / toggleUtility / setUtilities / resetUtilities` shape with different storage keys.

**Fix:** See `docs/pattern/TODO.md` — `createUtilityStore` factory.

---

## Rules

1. **Extract when the same decision appears in 2+ places** — not just similar code, but identical logic.
2. **Utility functions belong in `src/utils/`** — not defined inline inside components or providers.
3. **Constants belong in `src/constants/`** — format strings, magic numbers, color codes.
4. **Shared components belong in `src/components/commons/` or `src/components/primitives/`** — not copy-pasted across domain folders.
5. **Do not DRY prematurely** — wait until the same thing appears at least twice before extracting.
