import { createContext, useCallback, useContext, useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { getInvoiceTypesApi } from '@/apis/invoice/invoice';
import { InvoiceTypeResponse } from '@/interfaces/invoice-type-interfaces';

interface InvoiceTypeContextType {
  invoiceTypes: InvoiceTypeResponse[];
  isLoadingInvoiceTypes: boolean;
  isRefreshingInvoiceTypes: boolean;
  refreshInvoiceTypes: () => void;
  getInvoiceTypeByCode: (code: string) => InvoiceTypeResponse | undefined;
  getInvoiceTypeById: (id: string) => InvoiceTypeResponse | undefined;
}

const InvoiceTypeContext = createContext<InvoiceTypeContextType | null>(null);

export function useInvoiceTypeContext() {
  const ctx = useContext(InvoiceTypeContext);
  if (!ctx)
    throw new Error(
      'useInvoiceTypeContext must be used within InvoiceTypeProvider'
    );
  return ctx;
}

export function InvoiceTypeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: invoiceTypes,
    isLoading: isLoadingInvoiceTypes,
    isRefreshing: isRefreshingInvoiceTypes,
    executeFetchFn: fetchInvoiceTypes,
    refreshFetchFn: refreshInvoiceTypes,
  } = useFetchFn(() => getInvoiceTypesApi(), {
    fetchKey: 'invoice-types',
    tags: ['invoice-types'],
  });

  useEffect(() => {
    fetchInvoiceTypes();
  }, [fetchInvoiceTypes]);

  const getInvoiceTypeByCode = useCallback(
    (code: string) => invoiceTypes?.find((t) => t.code === code),
    [invoiceTypes]
  );

  const getInvoiceTypeById = useCallback(
    (id: string) => invoiceTypes?.find((t) => t.id === id),
    [invoiceTypes]
  );

  return (
    <InvoiceTypeContext
      value={{
        invoiceTypes: invoiceTypes ?? [],
        isLoadingInvoiceTypes,
        isRefreshingInvoiceTypes,
        refreshInvoiceTypes,
        getInvoiceTypeByCode,
        getInvoiceTypeById,
      }}
    >
      {children}
    </InvoiceTypeContext>
  );
}
