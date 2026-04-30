# DRY — Don't Repeat Yourself

## What

Every piece of knowledge must have a single, unambiguous representation in the system. When logic, structure, or data must change, it should require modification in exactly one place.

DRY does not mean "never write similar code". It means "never duplicate decisions". Incidental structural similarity is not a DRY violation. Identical business logic copied across files is.

### ✅ Done well

**`buildFilterQueryString` utility**
Every paginated list endpoint needs date range + extra filter params in the query string. This logic is written once in `src/utils/api-helpers.ts` and called from every relevant API function.

**Shared primitives layer**
`Button`, `Input`, `Select`, `Modal`, `Loader`, etc. are defined once in `src/components/primitives/` and reused across all domains. Touch handling, loading states, and styling live in one place.

**Interface-driven API typing**
Request and response types are defined once in `src/interfaces/*-interfaces.ts` and shared between API functions, providers, and components — never redefined inline.

### ❌ Current violations

**`formatDateRange` logic duplicated in three card components**

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

**Receipt payment prefetch pattern duplicated in card components**

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

**Two PDF generator files (~664 lines each) share 95% of their code**

`src/utils/tour-calculation-cancel-log-pdf.ts` and `src/utils/tour-settlement-cancel-log-pdf.ts` duplicate `escapeHtml`, `formatDateTime`, `buildReceiptPaymentRows`, the full CSS block, and most of the HTML template structure.

**Fix:**
1. Create `src/utils/tour-pdf-helpers.ts` with all shared functions.
2. Keep only the domain-specific HTML sections in each original file.
3. Both files import from `tour-pdf-helpers.ts`.

---

**Date format string `'DD/MM'` as a magic string repeated ~8 times**

Same literal appears in `project-card.tsx`, `invoice-card.tsx`, `tour-card.tsx`, `booking-card.tsx`, and inside the `formatDateRange` calls.

**Fix:** Define `const DATE_FORMAT_SHORT = 'DD/MM'` in `src/constants/app-constant.ts` and reference it everywhere.

---

**Zustand utility stores are structurally identical**

`use-organization-utility-store.ts` and `use-personal-utility-store.ts` implement the same `selections / toggleUtility / setUtilities / resetUtilities` shape with different storage keys.

**Fix:** Extract a `createUtilityStore` factory shared between both.

---

## Why

When logic exists in one place, fixing a bug or updating behaviour requires touching exactly one file — and TypeScript propagates the change to every caller automatically. When the same decision is duplicated across files, a change requires finding every copy. Copies drift: different files apply different fixes, different formatting strings, different error messages. The more copies exist, the harder it is to be certain that a change is complete.

---

## How

1. **Extract when the same decision appears in 2+ places** — not just similar code, but identical logic.
2. **Utility functions belong in `src/utils/`** — not defined inline inside components or providers.
3. **Constants belong in `src/constants/`** — format strings, magic numbers, color codes.
4. **Shared components belong in `src/components/commons/` or `src/components/primitives/`** — not copy-pasted across domain folders.
5. **Do not DRY prematurely** — wait until the same thing appears at least twice before extracting.
